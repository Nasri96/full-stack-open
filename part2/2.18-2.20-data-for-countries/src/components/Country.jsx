const Country = ({ country }) => {

    if(country === null) {
        return null;
    }

    const { name, capital, area, languages, flag, temp, icon, wind } = country;

    return (
        <div>
            <h2>{name}</h2>
            <div>Capital {capital}</div>
            <div>Area {area}</div>
            <h3>Languages</h3>
            <ul>
            {languages.map(l => {
                return <li key={l}>{l}</li>
            })}
            </ul>
            <img src={flag} />
            
            <h3>Weather in {capital}</h3>
            <div>Temperature {temp} Celsius</div>
            <img src={`https://openweathermap.org/payload/api/media/file/${icon}.png`} />
            <div>Wind {wind} m/s</div>
        </div>
    )
}

export default Country;