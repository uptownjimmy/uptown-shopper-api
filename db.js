const Sequelize = require('sequelize');
const ItemModel = require('./models');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
)
const Item = ItemModel(sequelize, Sequelize);
const Models = { Item };
const connection = {};

module.exports = async () => {
  if (connection.isConnected) {
    return Models;
  }

  await sequelize.sync();
  await sequelize.authenticate();
  connection.isConnected = true;
  return Models;
}