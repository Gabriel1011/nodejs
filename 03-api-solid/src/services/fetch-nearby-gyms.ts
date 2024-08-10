import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface FetchNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymRepository: GymsRepository) { }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
