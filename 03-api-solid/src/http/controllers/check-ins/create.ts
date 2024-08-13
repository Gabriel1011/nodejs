import { makeCreateCheckInService } from '@/services/factories/make-create-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = request.params as { gymId: string }
  const { sub } = request.user

  await makeCreateCheckInService().execute({
    gymId,
    userId: sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send({
    latitude,
    longitude,
  })
}
