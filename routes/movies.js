import { Router } from 'express'
import movies from '../movies.json' with { type: 'json' }
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import crypto from 'node:crypto'

export const moviesRoutes = Router()

moviesRoutes.get('/', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filteredMovies)
  }
  res.json(movies)
})

moviesRoutes.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

moviesRoutes.post('/', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    // 422 es un status code que indica que la peticion es correcta pero el servidor no puede procesarla
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  // esto no es REST porque estamos guardando el estado de la aplicacion en memoria
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  // añadimos la nueva pelicula al array de peliculas, esto se hara luego en una base de datos
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

moviesRoutes.patch('/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  res.json(updatedMovie)
})

moviesRoutes.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})
