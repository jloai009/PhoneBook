require('dotenv').config()
const Person = require('./models/person')
const { nanoid } = require('nanoid')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('post-info', function (req, res) {
  if (req.method != 'POST') {
    return ''
  }
  return (JSON.stringify({
    name: req.body.name,
    number: req.body.number
  }))
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['post-info'](req, res)
  ].join(' ')
}))

const persons = [
  {
    id: nanoid(),
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: nanoid(),
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: nanoid(),
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: nanoid(),
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

const getInfo = () => (
    `<p><strong>Phonebook</strong> has info for ${persons.length} people.</p>\n
     <p>${new Date()}</p>`
)

app.get('/info', (req, res) => {
  res.send(getInfo())
})

app.get('/api/persons', (req, res) => {
  // console.log(persons)
  // res.json(persons)
  Person.find({}).then(result => {
    console.log(result)
    console.log('PhoneBook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    res.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  let personAlreadyExists = false
  for (const old_person of persons) {
    if (person.name === old_person.name) {
      personAlreadyExists = true
      break
    }
  }
  if (personAlreadyExists) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  } else if (!person.name) {
    return res.status(400).json({
      error: 'Person doesn\'t have a name'
    })
  } else if (!person.number) {
    return res.status(400).json({
      error: 'Person doesn\'t have a number'
    })
  }

  person
    .save()
    .then(response => {
      console.log(response)
      res.json(person)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const note = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(`Incoming DELETE ${request.params.id}`)
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log('DELETE successful')
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndPoint = (request, response) => {
  response.status(400).send({ error: 'unknown endpoint' })
}
app.use(unknownEndPoint)

const errorHandler = (error, request, reponse, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return reponse.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
