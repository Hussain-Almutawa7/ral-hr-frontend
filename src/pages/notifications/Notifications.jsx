import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import * as notificationService from '../../services/notificationService'
import Button from "../../components/common/Button"

const Notifications = (props) => {
    const [notifications, setNotifications] = useState([])
    const navigate = useNavigate()

    const unreadNotifications = notifications.filter((notification) => !notification.isRead)

    useEffect(() => {
        const fetchAllNotifications = async () => {
            const notificationsData = await notificationService.index()
            setNotifications(notificationsData)
        }

        fetchAllNotifications()
    }, [])

    const handleClick = async (notification) => {
        await notificationService.read(notification._id)
        navigate(notification.link)
    }

    const handleMarkRead = async (notification) => {
        await notificationService.read(notification._id)
        setNotifications(
            notifications.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
        )
    }

    const handleMarkAllRead = async () => {
        await notificationService.readAll()
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
    }

    return (
        <div>
            <h1>Notifications</h1>
            {unreadNotifications.length > 0 ? (
                <div>
                    <Button onClick={handleMarkAllRead}>Mark all as read</Button>
                    <div className="container">
                        {unreadNotifications.map((notification) => (
                            <div key={notification._id} onClick={() => handleClick(notification)} className="card" style={{ cursor: 'pointer' }}>
                                <h3>{notification.title}</h3>
                                <p>{notification.message}</p>
                                <div className="read-btn">
                                    <Button onClick={(e) => { e.stopPropagation(); handleMarkRead(notification) }} >
                                        Mark as read
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No notifications.</p>
            )}
        </div>
    )
}

export default Notifications;