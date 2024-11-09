/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
  seeds: ['dist/database/seeders/**/*.js'],
  factories: ['dist/database/factories/**/*.js'],
  timezone: '+00:00',
};
