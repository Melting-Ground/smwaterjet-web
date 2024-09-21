/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notice_contents', function(table) {
        table.integer('notice_id').primary();
        table.binary('notice_content').notNullable(); 
        table.foreign('notice_id').references('id').inTable('notices'); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('notice_contents'); 
};
