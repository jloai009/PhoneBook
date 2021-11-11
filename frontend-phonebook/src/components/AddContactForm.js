import React from 'react'

const AddContactForm = ({
  addPerson, newName, handleNewName, newNumber, handleNewNumber
}) => {
  return (
    <div>
      <h2>Add a Contact:</h2>
      <form onSubmit={addPerson}>
        <table>
          <tbody>
            <tr>
              <td>Name: </td><td><input value={newName} onChange={handleNewName}/></td>
            </tr>
            <tr>
              <td>Number:&nbsp;</td><td><input value={newNumber} onChange={handleNewNumber}/></td>
            </tr>
          </tbody>
        </table>
        <div><button type="submit">add</button></div>
      </form>
    </div>
  )
}

export default AddContactForm