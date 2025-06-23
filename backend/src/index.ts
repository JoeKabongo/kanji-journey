import express from 'express'
import cors from 'cors'
import routes from './routes/index'

const app = express()
app.use(cors(), express.json())

app.use('/api', routes)

app.get('/', (_req, res) => {
  res.send({ status: 'OK' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`)
})

export default app
