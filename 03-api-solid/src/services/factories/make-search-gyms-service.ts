import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsService } from '../search-gyms'

export function searchGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymsService = new SearchGymsService(gymsRepository)
  return searchGymsService
}
