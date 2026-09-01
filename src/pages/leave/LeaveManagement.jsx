import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import * as leaveRequestService from '../../services/leaveRequestService'
import * as leaveTypeService from "../../services/leaveTypeService";
import * as leaveAllocationService from "../../services/leaveAllocationService";

const HR_ROLES = ["HR Officer", "HR Manager"]

const LeaveManagement = (props) => {
    const [leaveRequests, setLeaveRequests] = useState([])
    const [rejectingRequestId, setRejectingRequestId] = useState(null)
    const [rejectionReason, setRejectionReason] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllRequests = async () => {
            const requestsData = await leaveRequestService.index()
            setLeaveRequests(requestsData)
        }

        fetchAllRequests()
    }, [])

    const isHR = HR_ROLES.includes(props.user.role)
    const canReview = (request) => {
        return isHR || props.user.employee === request.approver._id
    }
    const canAccessPage = isHR || props.user.role === "Manager"
    const reviewableRequests = leaveRequests.filter((request) => request.status !== "Draft")

    const handleApprove = async (requestId) => {
        await leaveRequestService.review(requestId, { decision: "Approved" })

        setLeaveRequests(
            leaveRequests.map((request) =>
                request._id === requestId ? { ...request, status: "Approved" } : request
            )
        )
    }

    const handleRejectClick = (requestId) => {
        setRejectingRequestId(requestId)
    }

    const handleConfirmReject = async () => {
        if (!rejectionReason) {
            return
        }

        await leaveRequestService.review(rejectingRequestId, { decision: "Rejected", reason: rejectionReason })

        setLeaveRequests(
            leaveRequests.map((request) =>
                request._id === rejectingRequestId ? { ...request, status: "Rejected", rejectionReason } : request
            )
        )

        setRejectingRequestId(null)
        setRejectionReason('')
    }

    return (
        <div>
            <h1>Leave Management</h1>
            {canAccessPage && (
                <table>
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Total Days</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviewableRequests.map((request) => (
                            <tr
                                key={request._id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/leave/${request._id}`)}
                            >
                                <td>{request.employee.nameEn}</td>
                                <td>{request.leaveType.leaveTypeName}</td>
                                <td>{new Date(request.fromDate).toLocaleDateString()}</td>
                                <td>{new Date(request.toDate).toLocaleDateString()}</td>
                                <td>{request.totalDays}</td>
                                <td>{request.status}</td>
                                <td>
                                    {canReview(request) && request.status === "Pending" && (
                                        <>
                                            <button onClick={(e) => { e.stopPropagation(); handleApprove(request._id) }}>
                                                ✔️
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleRejectClick(request._id) }}>
                                                ✖️
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default LeaveManagement;