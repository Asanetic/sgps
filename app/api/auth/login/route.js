import { mosyFlexSelect , mmres , base64Encode } from '../../apiUtils/dataControl/dataUtils';
import saAuthConfigs from '../../../auth/featureConfig/saAuthConfigs';
import { generateAuthToken } from '../authManager';

export async function POST(loginAuth) {
  const oauthTable = saAuthConfigs.oauthTable;
  const usernameCol = saAuthConfigs.usernameCol;
  const emailCol = saAuthConfigs.emailCol;
  const passwordCol = saAuthConfigs.passwordCol;
  const sessionColumns = saAuthConfigs.sessionColumns

  try {
    let body = {};
    const contentType = loginAuth.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    if (isMultipart) {
      const formData = await loginAuth.formData();
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }
    } else {
      body = await loginAuth.json();
    }

    const authLoginAction = body.auth_mosy_action;
    const authLoginUsername = body.txt_username;
    const authLoginPassword = body.txt_password;
    

    if (authLoginAction === 'auth_login') {
      // Protect against SQL injection-ish: escape single quotes
      const safeUsername = mmres(authLoginUsername);
      const safePassword = mmres(authLoginPassword)

      const loginQuery = `WHERE ${emailCol} = '${safeUsername}' AND ${passwordCol} = '${safePassword}'`
      
      console.log("loginQuery "+loginQuery)
      const enhancedParams = {
        tbl: oauthTable,
        colstr: base64Encode(sessionColumns), // base64 of '*'
        q: base64Encode(loginQuery),
      };

      const result = await mosyFlexSelect(enhancedParams);

      if (!result?.data || result.data.length === 0) {
        return Response.json(
          {
            status: 'error',
            message: 'Invalid username or password',
          },
          { status: 403 }
        );
      }

      const userData = { ...result.data[0] };
      
      const authToken =generateAuthToken(userData)

      // Remove the password field
      delete userData[passwordCol];

      return Response.json({
        status: 'success',
        message: `Login successful`,
        accessToken : authToken,
        user: userData,
      });
      
    }

    return Response.json(
      {
        status: 'error',
        message: `Invalid action: ${authLoginAction}`,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error('Request failed:', err);
    return Response.json(
      {
        status: 'error',
        message: `Data post error: ${err.message}`,
      },
      { status: 500 }
    );
  }
}