const Sequelize = require('sequelize');


const sequelize = new Sequelize(
  process.DB_NAME,
  process.DB_USER,
  process.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3001
  }
);

module.exports = sequelize;
