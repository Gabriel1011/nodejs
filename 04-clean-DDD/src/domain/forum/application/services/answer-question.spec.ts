import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionService } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryRepository: InMemoryAnswersRepository
let sut: AnswerQuestionService

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionService(inMemoryRepository)
  })

  it('Should be able to create a answer ', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Nova resposta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0]).toEqual(result.value?.answer)
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
