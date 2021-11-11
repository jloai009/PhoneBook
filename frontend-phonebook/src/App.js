import React, { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import AddContactForm from './components/AddContactForm'
import Contacts from './components/Contacts'
import contactServices from './services/contactServices'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [notification, setNotification] = useState(null)
  const [errorOcurred, setError] = useState(false)
  
  const contactAddedNotification = (person) => {
    setNotification(`Added ${person.name}`)
    setTimeout(() => setNotification(null), 5000)
  }


  useEffect(() => {
    contactServices.get().then(contacts => {
    //console.log(contacts)
    setPersons(contacts)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    let newPersonName = newName.trim()
    if (newPersonName.length === 0) {
        setNewName('')
        return
    }

    newPersonName = newPersonName.split(' ').map(w =>
      w[0].toUpperCase() + w.substr(1).toLowerCase()
    ).join(' ')

    const newPerson = {
      name: newPersonName,
      number: newNumber,
      id: nanoid()
    }

    for (let person of persons) {
      if (person.name === newPersonName) {
        if (window.confirm(`${newName} is already added to phonebook. Do you want to replace the number?`)) {
          newPerson.id = person.id
          contactServices.put(newPerson).then(new_person => {
            setPersons(persons.map(p => p.id !== new_person.id ? p : new_person))
            setNotification(`Updated ${person.name}'s number`)
            setTimeout(() => setNotification(null), 4000) 
          }).catch(error =>
            alert('There was an error contacting the database')
          )
          return
        } else {
          setNewName('')
          setNewNumber('')
          return
        }

      }
    }

    contactServices
      .post(newPerson)
      .then(response => {
        setPersons(persons.concat(response))
        setNewNumber('')
        setNewName('')
        contactAddedNotification(response)
      })
      .catch(error => {
        console.log(error.response.data.error)
        setError(true)
        setNotification(error.response.data.error)
        setTimeout(() => {
          setNotification(null)
          setError(false)
        }, 6000)
      })
    

  }

  const [newName, setNewName] = useState('')
  const handleNewName = (event) =>
    setNewName(event.target.value)
  
  const [newNumber, setNewNumber] = useState('')
  const handleNewNumber = (event) =>
    setNewNumber(event.target.value)
  
  const [searchStr, setSearchStr] = useState('')
  const handleSearch = (event) =>
    setSearchStr(event.target.value)
  
  let personsToShow = persons
  if (searchStr.length > 0) {
    personsToShow = persons.filter(person =>
      person.name.toLowerCase().includes(searchStr.toLowerCase())
    )
  }



  return (
    <div>
      <h1>Phone Book</h1>
      <Notification message={notification} isError={errorOcurred}/>
      <AddContactForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <Contacts
        persons={personsToShow}
        setPersons={setPersons}
        searchStr={searchStr}
        handleSearch={handleSearch}
        setNotification={setNotification}
        setError={setError}
      />
    </div>
  )
}

export default App
