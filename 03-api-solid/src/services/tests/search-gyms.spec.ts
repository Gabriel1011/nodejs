import { test, expect, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsService } from '../search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  test('should be able to search for gyms', async () => {
    await gymsRepository.create({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      name: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    const { gyms } = await sut.execute({ query: 'JavaScript', page: 1 })

    expect(gyms).toHaveLength(1)
  })

  test('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    }

    const { gyms } = await sut.execute({ query: 'JavaScript', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'JavaScript Gym 21' }),
      expect.objectContaining({ name: 'JavaScript Gym 22' }),
    ])
  })
})
