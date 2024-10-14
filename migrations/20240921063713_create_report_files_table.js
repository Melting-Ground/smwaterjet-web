/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('report_files', function(table) {
        table.increments('id').primary(); 
        table.integer('report_id').unsigned().notNullable();
        table.string('file_path').notNullable(); 
        table.foreign('report_id').references('id').inTable('reports'); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('report_files'); 
};

