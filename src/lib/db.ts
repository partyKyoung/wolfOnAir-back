import mysql from 'mysql';
import awsMysql from '../../config/awsMysql';

const { host, user, password, database} = awsMysql;

const db = mysql.createConnection({
  host,
  user,
  password,
  database
}); 

export default  db;