import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  const preHandlers = { preHandler: [checkSessionIdExists] }

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, description, amount, type } =
      createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      description,
      amount: type === 'credit' ? amount : -amount,
      session_id: sessionId,
    })

    return response.status(201).send()
  })

  app.get('/summary', preHandlers, async (request) => {
    const { sessionId } = request.cookies

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.get('/:id', preHandlers, async (request, response) => {
    const { sessionId } = request.cookies
    const getTransactionPramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionPramsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({ id, session_id: sessionId })
      .first()

    if (!transaction) {
      return response.status(404).send()
    }
    return { transaction }
  })

  app.delete('/:id', preHandlers, async (request, response) => {
    const { sessionId } = request.cookies
    const getTransactionPramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionPramsSchema.parse(request.params)

    await knex('transactions').where({ id, session_id: sessionId }).delete()

    return response.send()
  })

  app.get('/', preHandlers, async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions').where(
      'session_id',
      sessionId,
    )

    return { transactions }
  })
}
