import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import * as leaveRequestService from '../../services/leaveRequestService'

const MyLeave = (props) => {
    const [leaveRequests, setLeaveRequests] = useState([])

    const navigate = useNavigate()
    const myRequests = leaveRequests.filter((request) => request.employee._id === props.user.employee)

    useEffect(() => {
        const fetchAllRequests = async () => {
            const requestsData = await leaveRequestService.index()
            setLeaveRequests(requestsData)
        }

        fetchAllRequests()
    }, [])


    return (
        <div>
            <h1>My Leave</h1>
            <button onClick={() => navigate(`/leave/new`)}>Request a Leave</button>
            <table>
                <thead>
                    <tr>
                        <th>Leave Type</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Total Days</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {myRequests.map((request) => (
                        <tr
                            key={request._id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/leave/${request._id}`)}
                        >
                            <td>{request.leaveType.leaveTypeName}</td>
                            <td>{new Date(request.fromDate).toLocaleDateString()}</td>
                            <td>{new Date(request.toDate).toLocaleDateString()}</td>
                            <td>{request.totalDays}</td>
                            <td>{request.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default MyLeave;