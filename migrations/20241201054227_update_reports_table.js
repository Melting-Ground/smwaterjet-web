/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.schema.alterTable('reports', function (table) {
		table.dropColumn('author');
		table.dropColumn('content');
		table.dropColumn('uploaded_at');

		table.date('start_date').notNullable();
		table.date('end_date').notNullable();
		table.integer('year').notNullable()
		table.text('note');
	});
	await knex.schema.dropTableIfExists('report_files');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =  function (knex) {
	return knex.schema.dropTableIfExists('reports');
};
