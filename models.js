module.exports = (sequelize, type) => {
  return sequelize.define('item', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    type: type.STRING,
    active: type.INTEGER,
    note: type.STRING
  })
}