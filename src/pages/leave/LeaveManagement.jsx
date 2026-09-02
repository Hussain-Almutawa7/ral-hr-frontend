import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import * as leaveRequestService from '../../services/leaveRequestService'
import * as leaveTypeService from "../../services/leaveTypeService";
import * as leaveAllocationService from "../../services/leaveAllocationService";
import Modal from "../../components/common/Modal"
import formatDate from "../../utils/formatDate"
import StatusBadge from "../../components/common/StatusBadge"
import Button from "../../components/common/Button";

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

    if (!(isHR || props.user.role === "Manager")) {
        return <p>Not authorized to view this page.</p>
    }
    
    const canReview = (request) => {
        return isHR || props.user.employee === request.approver._id
    }
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
                            <td>{formatDate(request.fromDate)}</td>
                            <td>{formatDate(request.toDate)}</td>
                            <td>{request.totalDays}</td>
                            <td><StatusBadge status={request.status} /></td>
                            <td>
                                {canReview(request) && request.status === "Pending" && (
                                    <div className="actions">
                                        <Button variant="success" onClick={(e) => { e.stopPropagation(); handleApprove(request._id) }}>
                                            Approve
                                        </Button>
                                        <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleRejectClick(request._id) }}>
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal isOpen={!!rejectingRequestId} onClose={() => setRejectingRequestId(null)}>
                <label htmlFor="rejectionReason">Reason for rejection:</label>
                <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                />
                <button onClick={handleConfirmReject}>Confirm Rejection</button>
            </Modal>
        </div>
    )
}

export default LeaveManagement;