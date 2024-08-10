import { test, expect, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { GetUserProfileService } from '../get-user-profile'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let usersRepository: InMemoryUserRepository
let sut: GetUserProfileService

describe('Get user profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  test('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'not-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
