import request from 'supertest'
import { app } from '../src/app'
import { test, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('User can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'IFood',
        description: 'Japa',
        amount: 8000,
        type: 'debit',
      })
      .expect(201)
  })

  test('List all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'IFood',
        description: 'Japa',
        amount: 8000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    const listTransactionsRespose = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsRespose.body.transactions).toEqual([
      expect.objectContaining({
        title: 'IFood',
        description: 'Japa',
        amount: -8000,
      }),
    ])
  })

  test('Get specific transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'IFood',
        description: 'Japa',
        amount: 8000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    const listTransactionsRespose = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const [transaction] = listTransactionsRespose.body.transactions

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transaction.id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'IFood',
        description: 'Japa',
        amount: -8000,
      }),
    )
  })

  test('Get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'IFood',
        description: 'Japa',
        amount: 2000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.headers['set-cookie']

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Payment',
        description: 'Job',
        amount: 4000,
        type: 'credit',
      })

    const summaryRespose = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryRespose.body.summary).toEqual({ amount: 2000 })
  })
})
