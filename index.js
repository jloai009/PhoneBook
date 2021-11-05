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
        return ""
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



let persons = [
    { 
      "id": nanoid(),
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": nanoid(),
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": nanoid(),
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": nanoid(),
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
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
    //console.log(persons)
    //res.json(persons)
    Person.find({}).then(result => {
        console.log(result)
        console.log('PhoneBook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
 
})

app.post('/api/persons/', (req, res) => {

    let person = new Person({
        name: req.body.name,
        number: req.body.number
    })

    let personAlreadyExists = false
    for (let old_person of persons) {
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

    person.save().then(response => {
        console.log(response)
    })

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    console.log(`Deleting person with id ${id}`)
    res.status(204).end()
})



const unknownEndPoint = (request, response) => {
    response.status(400).send({ error: 'unknown endpoint' })
}
app.use(unknownEndPoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})