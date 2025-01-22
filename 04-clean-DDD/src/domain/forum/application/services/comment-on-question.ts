import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentOnQuestionRequest {
  authorId: string
  quesitonId: string
  content: string
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionService {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) { }

  async execute({
    authorId,
    quesitonId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionsRepository.findById(quesitonId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }
    const questionComment = QuestionComment.build({
      authorId: new UniqueEntityID(authorId),
      questionId: question.id,
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
