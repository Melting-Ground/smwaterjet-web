/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('inquiry_files', function(table) {
        table.increments('id').primary(); 
        table.integer('inquiry_id').unsigned().notNullable().references('id').inTable('inquiries');
        table.string('file_path').notNullable(); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('inquiry_files');
};
