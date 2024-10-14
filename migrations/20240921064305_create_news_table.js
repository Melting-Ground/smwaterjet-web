/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('news', function (table) {
        table.increments('id').primary();
        table.string('url').notNullable().unique();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.string('media').notNullable();
        table.date('published_at').nullable(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('news');
};
