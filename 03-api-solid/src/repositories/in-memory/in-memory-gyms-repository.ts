import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-instance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymUncheckedCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    } as Gym

    this.items.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const Gym = this.items.find((item) => item.id === id)
    return !Gym ? null : Gym
  }

  async search(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
