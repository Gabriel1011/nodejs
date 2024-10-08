import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchQuerySchema.parse(request.query)
  const gyms = await makeSearchGymsService().execute({
    query: q,
    page,
  })

  return reply.status(200).send(gyms)
}
