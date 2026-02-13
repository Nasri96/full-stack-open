
import { useState, useEffect } from "react";
import personsService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: ""});
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  const personsToShow = search ? persons.filter(person => person.name.toLowerCase() === search.toLowerCase()) : persons;


  // use efffect
  useEffect(() => {
    console.log("inside use effect");
    // fetch data
    personsService
      .getPersons()
      .then(persons => {
        // console.log(persons);
        setPersons(persons);
      })
      .catch(error => {
        setNotification({ message: "error in getPersons", type: "error" });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
    
  }, [])


  const handleNameChange = event => {
    setNewPerson({ ...newPerson, name: event.target.value });
  } 

  const handleNumberChange = event => {
    setNewPerson({ ...newPerson, number: event.target.value });
  }

  const handleSearchChange = event => {
    setSearch(event.target.value);
  }

  const handleAddPerson = event => {
    event.preventDefault();

    const foundPerson = persons.find(person => person.name === newPerson.name);

    if(foundPerson) {
      const confirmUpdate = confirm(`${foundPerson.name} is already added to phonebook, replace the old number with new a new one?`);

      if(confirmUpdate) {
        personsService
          .updatePerson(foundPerson.id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => {
              if(p.id !== foundPerson.id) {
                return p;
              } else {
                return { ...p, number: updatedPerson.number };
              }
            }));
            setNewPerson({ name: "", number: "" });
            setNotification({ message: `${updatedPerson.name}'s number has been updated`, type: "success "});
            setTimeout(() => {
              setNotification(null);
            }, 3000)
          })
          .catch(error => {
            setPersons(persons.filter(p => {
              if(p.id !== foundPerson.id) {
                return p;
              }

              return false;
            }));
            setNewPerson({ name: "", number: "" });
            setNotification({ message: `Information of ${foundPerson.name} has already been removed from server`, type: "error" });
            setTimeout(() => {
              setNotification(null);
            }, 3000);
          })
      }

      return;
    }

    personsService
      .createPerson(newPerson)
      .then(createdPerson => {
        // console.log(createdPerson);
        setPersons(persons.concat(createdPerson));
        setNewPerson({ name: "", number: "" });
        setNotification({ message: `Person ${createdPerson.name} has been created`, type: "success" });
        setTimeout(() => {
          setNotification(null);
        }, 3000)
      })
      .catch(error => {
        setNewPerson({ name: "", number: "" });
        setNotification({ message: "error in createPerson", type :"error" });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
  }

  const handleDeletePerson = id => {
    const personToDelete = persons.find(p => p.id === id);
    const confirm = window.confirm(`Delete ${personToDelete.name}`);
    if(confirm) {
      personsService
        .deletePerson(id)
        .then(deletedPerson => {
          // console.log(deletedPerson);
          setPersons(persons.filter(p => p.id !== deletedPerson.id));
          setNotification({ message: `${deletedPerson.name} has been deleted`, type: "success" });
          setTimeout(() => {
            setNotification(null);
          }, 3000)
        })
        .catch(error => {
          setNotification({ message: "error in deletePerson", type :"error" });
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        })
    }
      
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm 
        onAddPerson={handleAddPerson} 
        newPerson={newPerson} 
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App;
