/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.raw(`
        CREATE OR REPLACE VIEW inquiries_view AS
        SELECT 
            ROW_NUMBER() OVER (ORDER BY id) AS row_num,
            id,
			author,
			title,
			content,
			created_at
        FROM 
            inquiries
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.raw(`DROP VIEW IF EXISTS inquiries_view`);
};
