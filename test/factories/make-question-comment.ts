import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

import { faker } from '@faker-js/faker'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const questioncomment = QuestionComment.build(
    {
      authorId: new UniqueEntityID('author-1'),
      questionId: new UniqueEntityID('question-1'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return questioncomment
}
