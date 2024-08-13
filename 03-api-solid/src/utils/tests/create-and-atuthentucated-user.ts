import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticatedUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Gabriel Almeida',
    email: 'gabriel.almeida1@test.com.br',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'gabriel.almeida1@test.com.br',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
