const Countries = ({ countries, onHandleShowCountry }) => {
    
    if(!countries) {
        return null;
    }

    return (
        <div>
            {countries.map(c => <p key={c.name.common}>{c.name.common} <button onClick={onHandleShowCountry.bind(this, c.name.common)}>Show</button></p>)}
        </div>
    )
}

export default Countries;