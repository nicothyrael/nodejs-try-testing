'use strict';

module.exports = {
  name: 'Development',
  datacenterName: 'staging',
  readTimeout: 60000,
  queryLimit: 250,
  s3bucket: 'quickfix-test',

  locQuickFix: {
    user: 'DataStagingUser',
    password: 'travel',
    server: 'CHELLSSSQL34.karmalab.net',
    database: 'DataStaging',
    requestTimeout: 100000,
    options: {
      encrypt: false
    }
  },

};
