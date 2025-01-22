import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionService } from './comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionService

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionService(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('Should be able to comment on question', async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      quesitonId: question.id.toString(),
      content: 'Comentário teste',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
