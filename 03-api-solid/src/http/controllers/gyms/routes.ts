import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { search } from './search.controller'
import { register } from './register.controller'
import { nearby } from './nearby.controller'
import { verifiyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', { onRequest: [verifiyUserRole('ADMIN')] }, register)
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
}
