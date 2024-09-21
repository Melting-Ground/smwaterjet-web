/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('inquiry_files', function(table) {
        table.increments('id').primary(); 
        table.integer('inquiry_id').notNullable().references('id').inTable('inquiries');
        table.string('inquiry_file_title').notNullable(); 
        table.string('inquiry_file_path').notNullable(); 
        table.timestamp('upload_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('inquiry_files');
};
