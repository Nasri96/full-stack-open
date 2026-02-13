const Person = ({ person, onDeletePerson }) => {
    return (
        <div>
            {person.name} {person.number}
            <button onClick={onDeletePerson.bind(this, person.id)}>Delete</button>
        </div>
    )
}

export default Person;