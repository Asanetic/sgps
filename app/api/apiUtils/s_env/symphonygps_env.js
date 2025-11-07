
const mosyDbConfig = {
  local: {
    DB_HOST: 'localhost',
    DB_USER: 'root',
    DB_PASS: '',
    DB_NAME: 'symphonygps',
  },
  production: {
    DB_HOST: '127.0.0.1',
    DB_USER: 'root',
    DB_PASS: 'UltraSecurePass123!',
    DB_NAME: 'symphonygps',
  }
};

export default mosyDbConfig; 