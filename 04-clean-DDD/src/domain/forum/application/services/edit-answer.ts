import { Answer } from '../../enterprise/entities/answer'
import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditAnswerRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    editedAnswer: Answer
  }
>

export class EditAnswerService {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) { }

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.build({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answersRepository.save(answer)

    return right({ editedAnswer: answer })
  }
}
