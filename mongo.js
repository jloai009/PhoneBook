const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length === 4) {
  console.log('Error: there must be 1 or 3 command line arguments, but 2 were given')
  process.exit(1)
} else if (process.argv.length > 5) {
  console.log('Error: there must be at most 3 command line arguments')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.pqh3g.mongodb.net/phonebook?retryWrites=true&w=majority`

if (process.argv.length === 5) {
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  Person.find({}).then(result => {
    console.log('PhoneBook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
