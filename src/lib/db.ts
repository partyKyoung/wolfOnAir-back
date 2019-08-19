import mysql from 'mysql2';
import awsMysql from '../config/awsMysql';

const { host, user, password, database} = awsMysql;

const db = async () => {
  const connection = await mysql.createConnection({
    host, 
    user, 
    password, 
    database
  });
  
  return connection;
};

export default db;