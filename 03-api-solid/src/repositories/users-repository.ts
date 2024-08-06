import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findBtyId: (id: string) => Promise<User | null>
}
