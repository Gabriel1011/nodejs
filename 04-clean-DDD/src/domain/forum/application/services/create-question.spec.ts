import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionService } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionService

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new CreateQuestionService(inMemoryRepository)
  })

  it('Should be able to create a question ', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Nova pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0].id).toEqual(result.value?.question.id)
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
