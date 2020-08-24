import mysql from 'mysql';
import awsMysql from '../config/awsMysql';

const { host, user, password, database } = awsMysql;

const db = mysql.createPool({
  host,
  user,
  password,
  database
});

function querySql(queryString: string = ''): Promise<any> {

  return new Promise((resolve, reject) => {
    if (!queryString) {
      reject();
    }
  
    db.query(queryString, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
}

export default querySql;