/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.raw(`
        CREATE OR REPLACE VIEW reports_view AS
        SELECT 
            ROW_NUMBER() OVER (ORDER BY id) AS row_num,
			id,
            title,
			year,
			start_date,
			end_date,
			note
        FROM 
            reports
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.raw(`DROP VIEW IF EXISTS reports_view`);
};
