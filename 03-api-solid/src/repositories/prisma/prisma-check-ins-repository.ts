import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { DateTime } from 'luxon'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: page,
    })

    return checkIns
  }

  async countByUserId(userId: string) {
    const checkInsCount = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return checkInsCount
  }

  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })

    return updatedCheckIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = DateTime.fromJSDate(date).startOf('day')
    const endOfTheDay = DateTime.fromJSDate(date).endOf('day')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toJSDate(),
          lte: endOfTheDay.toJSDate(),
        },
      },
    })

    return checkIn
  }
}
