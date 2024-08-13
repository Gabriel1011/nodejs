import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInsService } from '../check-in'

export function makeCreateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const createCheckInService = new CheckInsService(
    checkInsRepository,
    gymsRepository,
  )
  return createCheckInService
}
