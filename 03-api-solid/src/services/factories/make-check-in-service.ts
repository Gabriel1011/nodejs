import { CheckInsRepository } from '@/repositories/prisma/check-ins-repository'
import { CheckInsService } from '../check-in'

export function makeCheckInService() {
  const checkInsRepository = new CheckInsRepository()
  const checkInsService = new CheckInsService(checkInsRepository)
  return checkInsService
}
