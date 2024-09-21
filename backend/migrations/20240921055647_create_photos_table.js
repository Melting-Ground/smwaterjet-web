/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('photos', function(table) {
        table.increments('id').primary(); 
        table.string('title').notNullable(); 
        table.string('path').notNullable(); 
        table.year('photo_year').notNullable();
        table.timestamp('uploaded_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('photos');
};
