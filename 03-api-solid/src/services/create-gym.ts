import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'
import { randomUUID } from 'node:crypto'

interface CreateGym {
  name: string
  description?: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymRepository: GymsRepository) { }

  async execute(newGym: CreateGym): Promise<CreateGymResponse> {
    const gym = await this.gymRepository.create({
      id: randomUUID(),
      ...newGym,
    })

    return { gym }
  }
}
