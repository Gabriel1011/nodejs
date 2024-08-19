import { AnswerQuestionService } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    answer.content = answer.content + 'teste'
  },
}

test('create an answer', async () => {
  const answerQuestionService = new AnswerQuestionService(fakeAnswersRepository)

  const answer = await answerQuestionService.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(answer.content).toEqual('Nova resposta')
})
