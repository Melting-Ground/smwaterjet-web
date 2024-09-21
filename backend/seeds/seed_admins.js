/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('admins').del()
  await knex('admins').insert([
    {id: 1, phone_number: '', password_hash:""},
    {id: 1, phone_number: '', password_hash:"" }
  ]);
};
