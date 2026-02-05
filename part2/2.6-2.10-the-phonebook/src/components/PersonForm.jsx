const PersonForm = ({ onAddPerson, newPerson, onNewNameChange, onPhoneNumberChange}) => {
    return (
        <form onSubmit={onAddPerson}>
            <div>
                name: 
                <input 
                type="text"
                value={newPerson.newName} 
                onChange={onNewNameChange}
                />
            </div>
            <div>
                number:
                <input 
                type="text" 
                value={newPerson.phoneNumber}
                onChange={onPhoneNumberChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm;