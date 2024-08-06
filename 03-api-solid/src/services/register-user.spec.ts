import { test, expect, beforeEach, describe } from 'vitest'
import { RegisterUserService } from './register-user'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

let registUserService: RegisterUserService

describe('Register user', () => {
  beforeEach(() => {
    registUserService = new RegisterUserService(new InMemoryUserRepository())
  })

  test('should be able to register', async () => {
    const { user } = await registUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  test('should  hash user password upon registration', async () => {
    const { user } = await registUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(true).toBe(await compare('123456', user.password_hash))
  })

  test('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await registUserService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registUserService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
