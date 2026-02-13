import Person from "./Person";

const Persons = ({ persons, onDeletePerson }) => {
    return (
        <div>
            {persons.map(person => {
                return (
                    <Person key={person.name} person={person} onDeletePerson={onDeletePerson} />
                )
            })}
        </div>
    )
}

export default Persons;