const knex = require('knex');
const dbConfig = require('../../config/knexfile');

const db = knex(dbConfig);

module.exports = db;