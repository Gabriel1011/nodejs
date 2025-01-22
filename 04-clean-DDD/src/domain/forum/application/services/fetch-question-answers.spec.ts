import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersService } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersService

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersService(inMemoryRepository)
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )

    const result = await sut.execute({
      questinId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated questions answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({ questinId: 'question-1', page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
