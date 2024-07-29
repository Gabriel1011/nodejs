"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary();
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.date('create_at').defaultTo(knex.fn.now()).notNullable();
    });
}
async function down(knex) {
    await knex.schema.dropTable('transactions');
}
