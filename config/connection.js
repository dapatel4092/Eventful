require('dotenv').config();
const Sequelize = require('sequelize');


// const sequelize = new Sequelize(
//   process.DB_NAME,
//   process.DB_USER,
//   process.DB_PASSWORD,
//   {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
//   }
// );
const sequelize = new Sequelize(
"Eventful_db",
  "root",
  "JackandJillwentupthehill!",
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
);

module.exports = sequelize;
