/**
* Module exports.
* @public
*/


module.exports = errDiary

/**
* Module dependencies.
* @private
*/

const fs = require('fs');
const path = require('path');

const appDir = path.dirname(require.main.filename);
const logPath = path.join(appDir, '/logs/')

const getTodayDate = () => {
  const nowDate = new Date();
  return `${nowDate.getDate()}-${(nowDate.getMonth() + 1)}-${nowDate.getFullYear()}`;
};

const errorLogger = (req, res, filePath) => {
  if (res.statusCode > 400) {
    if (filePath) {
      fs.appendFileSync(filePath, `${new Date} API: ${req.originalUrl} Status: ${res.statusCode} Response: ${res.err}\n`);
    }
  }
}

const responseLogger = (req, res, filePath) => {
  if (res.statusCode < 400) {
    if (filePath) {
      fs.appendFileSync(filePath, `${new Date} API: ${req.originalUrl} Status: ${res.statusCode}\n`);
    }
  }
}

function errDiary({ logError = true, logSuccess = false }) {
  return function logger(req, res, next) {
    res.on('finish', () => {
      fs.existsSync(logPath) || fs.mkdirSync(logPath);

      const filePath = path.join(logPath, `${getTodayDate()}.log`)
      if (logError) {
        errorLogger(req, res, filePath)
      }
      if (logSuccess) {
        responseLogger(req, res, filePath)
      }
    })
    next();
  };
}

const test = 'pew'