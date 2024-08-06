import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserService } from '../register-user'

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository()
  return new RegisterUserService(usersRepository)
}
