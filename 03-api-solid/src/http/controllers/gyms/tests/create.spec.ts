import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticatedUser } from '@/utils/tests/create-and-atuthentucated-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create gym', async () => {
    const { token } = await createAndAuthenticatedUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Engenharia do Corpo',
        description: 'Academia de musculação',
        phone: '13999999999',
        latitude: 90,
        longitude: 1,
      })

    expect(response.statusCode).toEqual(201)
  })
})
