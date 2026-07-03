import { useContext } from "react";
import NotificationContext from "../notificationContext";

const Notification = () => {
  const { notificationMessage } = useContext(NotificationContext);

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (notificationMessage === null) return null

  return (
    <div style={style}>
      {notificationMessage}
    </div>
  )
}

export default Notification;