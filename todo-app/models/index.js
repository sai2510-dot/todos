'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  // If you use a connection URL environment variable
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Use the config options (e.g., dialect, storage for SQLite)
  sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: false, // optional: turn off SQL logs
  });
}

// Read all model files in the models folder except this file
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // Import the model and initialize it with sequelize
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// If any model has associations, set them up
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize instance and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
