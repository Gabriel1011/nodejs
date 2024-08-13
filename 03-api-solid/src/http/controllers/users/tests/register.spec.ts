import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Gabriel Almeida',
      email: 'gabriel.almeida@test.com.br',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
