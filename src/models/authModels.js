const mySql = require("../database/databaseMysql");

const createAccountModel = (data) => {
  return new Promise((resolve, reject) => {
    const queryString = "INSERT INTO auth SET?";
    mySql.query(queryString, data, (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
};

const checkEmailModel = (email) => {
    return new Promise((resolve, reject) => {
      const queryString = "SELECT email FROM auth WHERE email = ?";
      mySql.query(queryString, email, (error, results) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(results);
        }
      });
    });
  };

  const userByEmailModel = (email) => {
    return new Promise((resolve, reject) => {
      const queryString = `SELECT * FROM auth WHERE email=?`;
      mySql.query(queryString, email, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  const getAccountInfo = (qsValue) => {
    return new Promise((resolve, reject) => {
      const qs =
        "SELECT id, name, email FROM auth WHERE id = ?";
      mySql.query(qs, qsValue, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

module.exports = {
    createAccountModel,
    checkEmailModel,
    userByEmailModel,
    getAccountInfo
}