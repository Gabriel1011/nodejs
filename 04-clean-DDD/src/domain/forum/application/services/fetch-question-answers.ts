import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersRequest {
  questinId: string
  page: number
}

type QuestionAnswersResponse = Either<null, { answers: Answer[] }>

export class FetchQuestionAnswersService {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    questinId,
    page,
  }: FetchQuestionAnswersRequest): Promise<QuestionAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questinId,
      { page },
    )

    return right({ answers })
  }
}
