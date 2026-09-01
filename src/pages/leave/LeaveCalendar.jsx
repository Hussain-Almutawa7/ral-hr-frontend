import { useEffect, useState } from "react"
import * as leaveRequestService from "../../services/leaveRequestService";
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import enUS from "date-fns/locale/en-US"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "../../styles/calendar.css"

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const LeaveCalendar = (props) => {
    const [leaveRequests, setLeaveRequests] = useState([])
    const [events, setEvents] = useState([])
    const [date, setDate] = useState(new Date())
    const [view, setView] = useState('month')

    useEffect(() => {
        const fetchAllRequests = async () => {
            const requestsData = await leaveRequestService.calendar()
            setLeaveRequests(requestsData)

            const transformedEvents = requestsData.map((request) => {
                const halfDayLabel = request.isHalfDay ? " (Half Day)" : ""

                return {
                    title: `${request.employee.nameEn} - ${request.leaveType.leaveTypeName}${halfDayLabel}`,
                    start: new Date(request.fromDate),
                    end: new Date(request.toDate),
                    allDay: true,
                }
            })
            setEvents(transformedEvents)
        }

        fetchAllRequests()
    }, [])
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                date={date}
                onNavigate={setDate}
                view={view}
                onView={setView}
            />
        </div>
    )
}

export default LeaveCalendar