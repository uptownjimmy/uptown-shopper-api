const Sequelize = require('sequelize');
const ItemModel = require('./models');
const sequelize = new Sequelize(
  'uptown_shopper_db',
  'uptownjimmy',
  '4e931KXvEHB^',
  {
    dialect: 'mysql',
    host: 'uptown-cluster.cluster-cl3jqrc7m9jt.us-east-1.rds.amazonaws.com',
    port: 3306
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