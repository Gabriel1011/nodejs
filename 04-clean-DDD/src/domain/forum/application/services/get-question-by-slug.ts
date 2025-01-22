import { QuestionsRepository } from '../repositories/questions-repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from '@/core/either'

interface GetQuestionBySlugRequest {
  slug: string
}

type GetQuestionBySlugResponse = Either<null, { question: Question }>

export class GetQuestionBySlugService {
  constructor(private questionsRepository: QuestionsRepository) { }

  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      throw new Error('Question not found.')
    }

    return right({ question })
  }
}
