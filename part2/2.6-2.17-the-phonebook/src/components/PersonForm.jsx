const PersonForm = ({ onAddPerson, newPerson, onNameChange, onNumberChange}) => {
    return (
        <form onSubmit={onAddPerson}>
            <div>
                name: 
                <input 
                type="text"
                value={newPerson.name} 
                onChange={onNameChange}
                />
            </div>
            <div>
                number:
                <input 
                type="text" 
                value={newPerson.number}
                onChange={onNumberChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm;