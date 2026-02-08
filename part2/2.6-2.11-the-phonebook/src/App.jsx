
import { useState, useEffect } from "react";
import axios from "axios";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  // const [newName, setNewName] = useState('');
  const [newPerson, setNewPerson] = useState({ newName: "", phoneNumber: ""});
  const [search, setSearch] = useState("");

  const personsToShow = search ? persons.filter(person => person.name.toLowerCase() === search.toLowerCase()) : persons;


  // use efffect
  useEffect(() => {
    console.log("inside use effect");
    // fetch data
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        console.log(response);
        // update state
        const data = response.data;
        setPersons(data);
      })
      .catch(error => {
        console.log(error);
      })
    
  }, [])


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
