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
    console.log('=> Using existing connection.');
    return Models;
  }

  await sequelize.sync();
  console.log('sequelize 1 ', sequelize);

  await sequelize.authenticate();
  console.log('sequelize 2 ', sequelize);

  connection.isConnected = true;
  console.log('=> Created a new connection.');
  return Models;
}