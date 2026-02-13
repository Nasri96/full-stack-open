const Notification = ({ message, type }) => {


    return (
        <div>
            <p className={`message ${type}`}>{message}</p>
        </div>
    )
}

export default Notification;