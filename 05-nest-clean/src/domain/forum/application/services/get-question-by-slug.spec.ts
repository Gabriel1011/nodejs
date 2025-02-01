import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugService } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugService

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugService(inMemoryRepository)
  })

  it('Should be able get question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('nova-pergunta'),
    })

    await inMemoryRepository.create(newQuestion)

    const result = await sut.execute({ slug: 'nova-pergunta' })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question.title).toEqual(newQuestion.title)
  })
})
