import pgPromise from 'pg-promise'
import dotenv from 'dotenv'

dotenv.config()

const pgp = pgPromise()
const db = pgp(
  process.env.NODE_ENV === 'test'
    ? (process.env.TEST_DATABASE_URL as string)
    : (process.env.DATABASE_URL as string)
)

export default db
