const { version } = require('../../package.json');

export const environment = {
  production: false,
  appVersion: version,
  apiBaseUrl: 'http://localhost:8080',
};
