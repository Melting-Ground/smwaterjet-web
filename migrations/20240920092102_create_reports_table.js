/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('reports', function(table) {
        table.increments('id').primary(); 
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.integer('year').notNullable(); 
        table.string('path').notNullable(); 
        table.timestamp('uploaded_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('reports');
};
