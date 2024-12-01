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
		table.text('note');
	});
	await knex.schema.dropTableIfExists('report_files');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
	await knex.schema.alterTable('reports', function (table) {
		table.dropColumn('start_date');
		table.dropColumn('end_date');
		table.dropColumn('note');

		table.string('author').notNullable();
		table.text('content').notNullable();
		table.timestamp('uploaded_at').defaultTo(knex.fn.now());
	});
};
