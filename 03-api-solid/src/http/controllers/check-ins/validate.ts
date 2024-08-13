import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validadeCheckInIdParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validadeCheckInIdParamsSchema.parse(request.params)

  await makeValidateCheckInService().execute({
    checkInId,
  })

  return reply.status(204).send()
}
