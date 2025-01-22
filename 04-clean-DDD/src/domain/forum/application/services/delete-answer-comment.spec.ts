import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentService } from './delete-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentService

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new DeleteAnswerCommentService(inMemoryAnswerCommentsRepository)
  })

  it('Should be able to delete answer comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('Should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-2'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)
    const result = await sut.execute({
      authorId: 'author-1',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
