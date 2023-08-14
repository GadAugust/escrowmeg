const env = require('./env');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.db_name, env.db_username, env.db_password, {
    host: env.db_host,
    //port: env.db_port,
    dialect: env.db_dialect,
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    /*dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },*/
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
module.exports = sequelize;
