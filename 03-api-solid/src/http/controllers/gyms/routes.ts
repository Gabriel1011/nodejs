import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { search } from './search.controller'
import { register } from './register.controller'
import { nearby } from './nearby.controller'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', register)
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
}
