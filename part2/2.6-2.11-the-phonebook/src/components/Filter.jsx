const Filter = ({ search, onSearchChange }) => {
    return (
        <div>
        filter shown with
        <input
          type="text"
          value={search}
          onChange={onSearchChange}
        />
      </div>
    )
}

export default Filter;