import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'
import { CheckIn, Prisma } from '@prisma/client'
import { DateTime } from 'luxon'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = DateTime.fromJSDate(date).startOf('day')
    const endOfTheDay = DateTime.fromJSDate(date).endOf('day')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = DateTime.fromJSDate(checkIn.created_at)
      const isOnSameDate =
        checkInDate >= startOfTheDay && checkInDate <= endOfTheDay

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return Promise.resolve(
      this.items
        .filter((item) => item.user_id === userId)
        .slice((page - 1) * 20, page * 20),
    )
  }
}
