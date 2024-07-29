// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    transactions: {
      id: string
      title: string
      description: string
      amount: number
      create_at: Date
      session_id: string
    }
  }
}
