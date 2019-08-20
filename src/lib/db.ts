import mysql from 'mysql';
import awsMysql from '../config/awsMysql';

const { host, user, password, database} = awsMysql;

const db = mysql.createPool({
  host,
  user,
  password,
  database
});

export function querySql(queryString: string = '') {
  if (!queryString) {
    return;
  }

  return new Promise((resolve, reject) => {
    db.query(queryString, (error, results, fields) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
}