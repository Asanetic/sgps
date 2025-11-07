
const mosyDbConfig = {
  local: {
    DB_HOST: 'localhost',
    DB_USER: 'root',
    DB_PASS: '',
    DB_NAME: 'firebirdb2c',
  },
  production: {
    DB_HOST: '127.0.0.1',
    DB_USER: 'nextadmin',
    DB_PASS: 'nextadmin001',
    DB_NAME: 'firebirdb2c',
  }
};

export default mosyDbConfig; 