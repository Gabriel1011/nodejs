import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    path: buildRoutePath('/'),
    method: 'GET',
    handler: (req, res) => {
      return res.end('Hello World')
    }
  },
  {
    path: buildRoutePath('/users'),
    method: 'GET',
    handler: (req, res) => {
      const { search } = req.query
      return res.end(JSON.stringify(database.select('users', search && { name: search, email: search })))
    }
  },
  {
    path: buildRoutePath('/users'),
    method: 'POST',
    handler: (req, res) => {
      const { name, email } = req.body

      database.insert('users', { id: randomUUID(), name, email })

      return res.writeHead(201).end()
    }
  },
  {
    path: buildRoutePath('/users/:id'),
    method: 'GET',
    handler: (req, res) => {
      const { id } = req.params
      return res.end(`User ${id}`)
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      database.delete('s', req.params.id)
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      database.update('users', id, { name, email })

      return res.writeHead(204).end()
    }
  }
]