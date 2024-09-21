/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('report_contents', function(table) {
        table.integer('report_id').primary(); 
        table.binary('report_content').notNullable();
        table.foreign('report_id').references('id').inTable('reports');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('report_contents');
};
