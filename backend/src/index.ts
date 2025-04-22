import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors(), express.json())

app.get('/', (_req, res) => {
  res.send({ status: 'OK' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`)
})
