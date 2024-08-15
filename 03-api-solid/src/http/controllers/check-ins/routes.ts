import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { metrics } from './metrics'
import { history } from './history'
import { validate } from './validate'
import { verifiyUserRole } from '@/http/middlewares/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', create)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifiyUserRole('ADMIN')] },
    validate,
  )
}
