import mysql from 'mysql2/promise';
import awsMysql from '../config/awsMysql';

const { host, user, password, database} = awsMysql;

const db = mysql.createPool({
  host,
  user,
  password,
  database
}); 

export default  db;