import { test, expect, beforeEach, describe } from 'vitest'
import { CreateGymService } from '../create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let createGymService: CreateGymService

describe('Register gym', () => {
  beforeEach(() => {
    createGymService = new CreateGymService(new InMemoryGymsRepository())
  })

  test('should be able to register', async () => {
    const { gym } = await createGymService.execute({
      name: 'Gym 1',
      description: 'Gym 1 description',
      phone: null,
      latitude: -22.90278,
      longitude: -43.2075,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
