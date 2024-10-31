/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('inquiries', function(table) {
        table.increments('id').primary();
        table.string('author').notNullable(); 
        table.string('password').notNullable();
        table.string('phone_number', 11).notNullable(); 
        table.string('email').notNullable();
        table.string('title').notNullable();  
        table.text('content').notNullable(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('inquiries');
};
