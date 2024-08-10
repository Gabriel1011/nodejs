import { test, expect, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch Near Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  test('should be able to fetch near gyms', async () => {
    await gymsRepository.create({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -43.2092052,
      longitude: -89.6401091,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
  })
})
