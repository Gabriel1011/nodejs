import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerRequest {
  authorId: string
  id: string
}

type DeleteAnswerResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswerService {
  constructor(private answersRepository: AnswersRepository) { }

  async execute({
    id,
    authorId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
