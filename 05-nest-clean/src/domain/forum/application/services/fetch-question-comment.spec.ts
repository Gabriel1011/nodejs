import { makeQuestionComment } from 'test/factories/make-question-comment'
import { FetchQuestionCommentsService } from './fetch-question-comments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

let inMemoryRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsService

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsService(inMemoryRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )

    const result = await sut.execute({
      questinId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated questions comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questinId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
