// const Sequelize = require('sequelize');
// const ItemModel = require('../models');
// const sequelize = new Sequelize(
//   process.env.DB_NAME, // 'uptown_shopper_db',
//   process.env.DB_USER, // 'uptownjimmy',
//   process.env.DB_PASSWORD, // '4e931KXvEHB^',
//   {
//     dialect: 'mysql',
//     host: process.env.DB_HOST, // 'uptown-cluster.cluster-cl3jqrc7m9jt.us-east-1.rds.amazonaws.com',
//     port: process.env.DB_PORT // 3306
//   }
// )
// const Item = ItemModel(sequelize, Sequelize);
// conaole.log('James Item: ', Item);
// const Models = { Item };
// const connection = {};

// module.exports = async () => {
//   if (connection.isConnected) {
//     return Models;
//   }

//   await sequelize.sync();
//   await sequelize.authenticate();
//   connection.isConnected = true;
//   return Models;
// }

const mysql = require('mysql')
const pool  = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

module.exports = pool