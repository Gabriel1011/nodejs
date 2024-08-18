import { test, expect } from "vitest"
import { AnswerQuestionService } from "./answer-question"
import { AnswersRepository } from "../repositories/answers-repository"
import { Answer } from "../entities/answer"

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return
  }
}

test('create an answer', async () => {
  const answerQuestionService = new AnswerQuestionService(fakeAnswersRepository)

  const answer = await answerQuestionService.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta'
  })

  expect(answer.content).toEqual('Nova resposta')
})