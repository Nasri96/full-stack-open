import { createContext, useState } from "react";


const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
    const [notificationMessage, setNotificationMessage] = useState(null);

    return (
        <NotificationContext.Provider value={{ notificationMessage, setNotificationMessage }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext;