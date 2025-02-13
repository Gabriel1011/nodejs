import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsRequest {
  questinId: string
  page: number
}

type FetchQuestionCommentsResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>

export class FetchQuestionCommentsService {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) { }

  async execute({
    questinId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questinId, {
        page,
      })

    return right({ questionComments })
  }
}
