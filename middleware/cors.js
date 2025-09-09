import cors from 'cors'

// Configuracion de CORS
// app.use(cors()) // permite cualquier origen
// app.use(cors({ origin: 'http://localhost:3000' })) // permite solo este origen
// app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:5500'] })) // permite estos dos origenes
// app.use(cors({ origin: '*' })) // permite cualquier origen, no recomendado para produccion

// metodos normales: get/head/post
// metodos complejos: put/patch/delete

// CORS PREFLIGHT
// OPTIONS

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'https://myapp.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (!origin || acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin not allowed by CORS'))
  }
}
)
