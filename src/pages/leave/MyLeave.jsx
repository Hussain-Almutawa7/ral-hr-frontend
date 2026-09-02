import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import * as leaveRequestService from '../../services/leaveRequestService'
import formatDate from "../../utils/formatDate"
import StatusBadge from "../../components/common/StatusBadge"
import Button from "../../components/common/Button";

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
            <div className="actions page-actions">
                <Button variant="primary" onClick={() => navigate(`/leave/new`)}>Request a Leave</Button>
            </div>
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
                            <td>{formatDate(request.fromDate)}</td>
                            <td>{formatDate(request.toDate)}</td>
                            <td>{request.totalDays}</td>
                            <td><StatusBadge status={request.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default MyLeave;