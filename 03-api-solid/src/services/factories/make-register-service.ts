import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserService } from '../create-gym'

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository()
  return new RegisterUserService(usersRepository)
}
