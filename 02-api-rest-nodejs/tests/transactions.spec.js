"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const vitest_1 = require("vitest");
const node_child_process_1 = require("node:child_process");
(0, vitest_1.describe)('Transactions Routes', () => {
    (0, vitest_1.beforeAll)(async () => {
        await app_1.app.ready();
    });
    (0, vitest_1.afterAll)(async () => {
        await app_1.app.close();
    });
    (0, vitest_1.beforeEach)(async () => {
        (0, node_child_process_1.execSync)('npm run knex migrate:rollback --all');
        (0, node_child_process_1.execSync)('npm run knex migrate:latest');
    });
    (0, vitest_1.test)('User can create a new transaction', async () => {
        await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'IFood',
            description: 'Japa',
            amount: 8000,
            type: 'debit',
        })
            .expect(201);
    });
    (0, vitest_1.test)('List all transactions', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'IFood',
            description: 'Japa',
            amount: 8000,
            type: 'debit',
        });
        const cookies = createTransactionResponse.headers['set-cookie'];
        const listTransactionsRespose = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(listTransactionsRespose.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: 'IFood',
                description: 'Japa',
                amount: -8000,
            }),
        ]);
    });
    (0, vitest_1.test)('Get specific transactions', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'IFood',
            description: 'Japa',
            amount: 8000,
            type: 'debit',
        });
        const cookies = createTransactionResponse.headers['set-cookie'];
        const listTransactionsRespose = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200);
        const [transaction] = listTransactionsRespose.body.transactions;
        const getTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .get(`/transactions/${transaction.id}`)
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(getTransactionResponse.body.transaction).toEqual(vitest_1.expect.objectContaining({
            title: 'IFood',
            description: 'Japa',
            amount: -8000,
        }));
    });
    (0, vitest_1.test)('Get the summary', async () => {
        const createTransactionResponse = await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .send({
            title: 'IFood',
            description: 'Japa',
            amount: 2000,
            type: 'debit',
        });
        const cookies = createTransactionResponse.headers['set-cookie'];
        await (0, supertest_1.default)(app_1.app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
            title: 'Payment',
            description: 'Job',
            amount: 4000,
            type: 'credit',
        });
        const summaryRespose = await (0, supertest_1.default)(app_1.app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200);
        (0, vitest_1.expect)(summaryRespose.body.summary).toEqual({ amount: 2000 });
    });
});
