import React from 'react'
import contactServices from '../services/contactServices'

const Contact = ({ person, delContact, setNotification }) => {

  return (
    <tr>
      <td>{person.name}&emsp;</td>
      <td>{person.number}&emsp;</td>
      <td><button onClick={delContact(person.id, person.name)}>Delete</button></td>
    </tr>
  )

}

const ContactsTable = ({ persons, setPersons, setNotification, setError }) => {

  const delContact = (id, name) => {
    return () => {
      if (window.confirm(`Are you sure you want to delete ${name}?`)) {
        contactServices.del(id).catch(error => {
          setError(true)
          setNotification(`Information of ${name} has already been removed from server`)
          setTimeout(() => {
            setNotification(null)
            setError(false)
          }, 4000)
        })
        setPersons(persons.filter(person => person.id !== id))
      }
    }
  }
    
  
  if (persons.length === 0) {
    return (
      <p>No Contacts Found</p>
    )
  } else return (
    <table>
      <thead>
        <tr>
        <td><strong>Names:</strong></td>
        <td><strong>Numbers:</strong></td>
        </tr>
      </thead>
      <tbody>
        {persons.map(person =>
          <Contact key={person.id} person={person} delContact={delContact}/>
        )}
      </tbody>
    </table>
  )
}

const Search = ({ searchStr, handleSearch }) => {
  return (
    <div>
      <div>
        Search by name:&ensp;<input value={searchStr} onChange={handleSearch}/>
      </div>
      <br />
    </div>
  )
}

const Contacts = ({ persons, setPersons, searchStr, handleSearch, setNotification, setError }) =>
    <div>
      <h2>Contact List:</h2>
      <Search searchStr={searchStr} handleSearch={handleSearch} />
      <ContactsTable persons={persons} setPersons={setPersons} setNotification={setNotification} setError={setError}/>
    </div>

export default Contacts