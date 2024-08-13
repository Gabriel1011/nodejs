import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const metrics = await makeGetUserMetricsService().execute({
    userId: sub,
  })

  return reply.status(200).send(metrics)
}
