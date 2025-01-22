import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionService } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionService

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new EditQuestionService(
      inMemoryRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('Should be able edit question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),

      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    })
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('Should not be able edit question by id', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await inMemoryRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: 'question-1',
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('Should not be able to edit a non-existent question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-not-exists',
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
