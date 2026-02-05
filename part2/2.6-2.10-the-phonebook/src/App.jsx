
import { useState } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phoneNumber: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phoneNumber: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phoneNumber: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phoneNumber: '39-23-6423122', id: 4 }
  ])
  // const [newName, setNewName] = useState('');
  const [newPerson, setNewPerson] = useState({ newName: "", phoneNumber: ""});
  const [search, setSearch] = useState("");

  const personsToShow = search ? persons.filter(person => person.name.toLowerCase() === search.toLowerCase()) : persons;


  const handleNewNameChange = event => {
    setNewPerson({ ...newPerson, newName: event.target.value });
  } 

  const handlePhoneNumberChange = event => {
    setNewPerson({ ...newPerson, phoneNumber: event.target.value });
  }

  const handleSearchChange = event => {
    setSearch(event.target.value);
  }

  const handleAddPerson = event => {
    event.preventDefault();

    const newNameIsDuplicate = persons.find(person => person.name === newPerson.newName);

    if(newNameIsDuplicate) {
      alert(`${newPerson.newName} is already added to phonebook`);
      return;
    }


    setPersons(persons.concat({ name: newPerson.newName, phoneNumber: newPerson.phoneNumber }));
    setNewPerson({ newName: "", phoneNumber: "" });
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm 
        onAddPerson={handleAddPerson} 
        newPerson={newPerson} 
        onNewNameChange={handleNewNameChange}
        onPhoneNumberChange={handlePhoneNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App;
