const argon2 = require('argon2');
require('dotenv').config();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('admins').del()

  const hashedPassword = await argon2.hash(process.env.INITIAL_PASSWORD);

  await knex('admins').insert([
    {phone_number: process.env.NUMBER_CHAN, password_hash: hashedPassword},
    {phone_number: process.env.NUMBER_MASTER, password_hash: hashedPassword}
  ]);
};
