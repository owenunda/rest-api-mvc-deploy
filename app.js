import express from 'express'

import { moviesRoutes } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'
// inicializamos express
const app = express()

// middlewares
// deshabilita la cabecera x-powered-by
app.disable('x-powered-by')
app.use(express.json())

app.use(corsMiddleware)

// todos los recursos que sean movies se identifican como /movies
app.use('/movies', moviesRoutes)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT} - app.js:21`)
})
