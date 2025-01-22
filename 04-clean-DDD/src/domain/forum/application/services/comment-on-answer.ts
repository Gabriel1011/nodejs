import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentOnAnswerRequest {
  authorId: string
  quesitonId: string
  content: string
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>

export class CommentOnAnswerService {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) { }

  async execute({
    authorId,
    quesitonId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answersRepository.findById(quesitonId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }
    const answerComment = AnswerComment.build({
      authorId: new UniqueEntityID(authorId),
      answerId: answer.id,
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return right({ answerComment })
  }
}
