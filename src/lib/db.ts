import mysql from 'mysql';
import { awsMySql } from '../config/aws';

const { host, user, password, database } = awsMySql;

const db = mysql.createPool({
  host,
  user,
  password,
  database
});

function querySql(queryString: string = '', queryValues: string[] =[]): Promise<any> {

  return new Promise((resolve, reject) => {
    if (!queryString) {
      reject();
    }
  
    db.query(queryString, queryValues, (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
}

export default querySql;