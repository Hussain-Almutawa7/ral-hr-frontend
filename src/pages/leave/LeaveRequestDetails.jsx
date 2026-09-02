import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import * as leaveRequestService from "../../services/leaveRequestService"
import Modal from "../../components/common/Modal"
import formatDate from "../../utils/formatDate"
import Button from "../../components/common/Button"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import Message from "../../components/common/Message"

const HR_ROLES = ["HR Officer", "HR Manager"]

const LeaveRequestDetails = (props) => {
    const { requestId } = useParams()
    const navigate = useNavigate()
    const [request, setRequest] = useState(null)
    const [showCancelReason, setShowCancelReason] = useState(false)
    const [cancellationReason, setCancellationReason] = useState('')

    const [showRejectReason, setShowRejectReason] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState(null)

    useEffect(() => {
        const fetchRequest = async () => {
            const requestData = await leaveRequestService.show(requestId)
            setRequest(requestData)
        }
        fetchRequest()
    }, [requestId])

    const handleSubmitRequest = async () => {
        try {
            await leaveRequestService.submit(requestId)
            navigate("/leave")
        } catch (error) {
            setError(error.message)
        }
    }

    const handleApprove = async () => {
        await leaveRequestService.review(requestId, { decision: "Approved" })
        setRequest({ ...request, status: "Approved" })
    }

    const handleRejectClick = () => {
        setShowRejectReason(true)
    }

    const handleConfirmReject = async () => {
        if (!rejectionReason) {
            return
        }

        await leaveRequestService.review(requestId, { decision: "Rejected", reason: rejectionReason })
        setRequest({ ...request, status: "Rejected", rejectionReason })
        setShowRejectReason(false)
        setRejectionReason('')
    }


    const handleCancelClick = () => {
        if (request.status === "Approved") {
            setShowCancelReason(true)
        } else {
            handleConfirmCancel()
        }
    }

    const handleConfirmCancel = async () => {
        if (request.status === "Approved") {
            if (!cancellationReason) {
                return
            }
            await leaveRequestService.cancel(requestId, { cancellationReason })
            setRequest({ ...request, status: "Cancelled", cancellationReason })
            setShowCancelReason(false)
            setCancellationReason('')
        } else {
            await leaveRequestService.cancel(requestId, {})
            setRequest({ ...request, status: "Cancelled" })
        }
    }

    const handleDownloadDocument = async (request) => {
        try {
            setActionLoading(request._id)
            setError('')
            await leaveRequestService.downloadRequestDocument(request._id, "leave-document")
        } catch (e) {
            setError(e.message)
        }
        finally {
            setActionLoading(null)
        }
    }

    if (!request) {
        return <LoadingSpinner>Loading...</LoadingSpinner>
    }

    const isOwner = props.user.employee === request.employee._id
    const isReviewer = HR_ROLES.includes(props.user.role) || props.user.employee === request.approver._id

    if (isOwner) {
        return (
            <div>
                {error && <Message type="error">{error}</Message>}
                <h1>{request.leaveType.leaveTypeName}</h1>

                <table>
                    <tbody>
                        <tr>
                            <th>From</th>
                            <td>{formatDate(request.fromDate)}</td>
                        </tr>
                        <tr>
                            <th>To</th>
                            <td>{formatDate(request.toDate)}</td>
                        </tr>
                        {request.isHalfDay && (
                            <tr>
                                <th>Half Day Date</th>
                                <td>{formatDate(request.halfDayDate)}</td>
                            </tr>
                        )}
                        <tr>
                            <th>Total Days</th>
                            <td>{request.totalDays}</td>
                        </tr>
                        {request.reason && (
                            <tr>
                                <th>Reason</th>
                                <td>{request.reason}</td>
                            </tr>
                        )}
                        <tr>
                            <th>Status</th>
                            <td>{request.status}</td>
                        </tr>
                        {request.status === "Rejected" && request.rejectionReason !== null && (
                            <tr>
                                <th>Rejection Reason</th>
                                <td>{request.rejectionReason}</td>
                            </tr>
                        )}
                        {request.status === "Cancelled" && request.cancellationReason !== null && (
                            <tr>
                                <th>Cancellation Reason</th>
                                <td>{request.cancellationReason}</td>
                            </tr>
                        )}
                        {request.documentFileId && (
                            <tr>
                                <th>Supporting Document</th>
                                <td>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleDownloadDocument(request)}
                                        disabled={actionLoading === request._id}
                                    >
                                        Download
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="actions">
                    {request.status === "Draft" && (
                        <Button onClick={handleSubmitRequest}>Submit Request</Button>
                    )}

                    {(request.status === "Draft" || request.status === "Pending" || request.status === "Approved") && (
                        <Button variant="secondary" onClick={handleCancelClick}>Cancel Request</Button>
                    )}
                </div>

                <Modal isOpen={showCancelReason} onClose={() => setShowCancelReason(false)}>
                    <div className="modal-content">
                        <h2>Cancel Approved Leave</h2>
                        <p>This leave was already approved. Please explain why it's being cancelled.</p>

                        <div className="form-group">
                            <label htmlFor="cancellationReason">Reason for cancellation:</label>
                            <textarea
                                id="cancellationReason"
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <Button variant="danger" onClick={handleConfirmCancel}>Confirm Cancellation</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

    if (isReviewer) {
        return (
            <div>
                <h1>{request.leaveType.leaveTypeName}</h1>

                <table>
                    <tbody>
                        <tr>
                            <th>Employee</th>
                            <td>{request.employee.nameEn}</td>
                        </tr>
                        <tr>
                            <th>Approver</th>
                            <td>{request.approver.nameEn}</td>
                        </tr>
                        <tr>
                            <th>From</th>
                            <td>{formatDate(request.fromDate)}</td>
                        </tr>
                        <tr>
                            <th>To</th>
                            <td>{formatDate(request.toDate)}</td>
                        </tr>
                        {request.isHalfDay && (
                            <tr>
                                <th>Half Day Date</th>
                                <td>{formatDate(request.halfDayDate)}</td>
                            </tr>
                        )}
                        <tr>
                            <th>Total Days</th>
                            <td>{request.totalDays}</td>
                        </tr>
                        {request.reason && (
                            <tr>
                                <th>Reason</th>
                                <td>{request.reason}</td>
                            </tr>
                        )}
                        <tr>
                            <th>Status</th>
                            <td>{request.status}</td>
                        </tr>
                        {request.balanceAtRequest !== null && (
                            <tr>
                                <th>Balance At Request</th>
                                <td>{request.balanceAtRequest}</td>
                            </tr>
                        )}
                        {request.status === "Rejected" && request.rejectionReason !== null && (
                            <tr>
                                <th>Rejection Reason</th>
                                <td>{request.rejectionReason}</td>
                            </tr>
                        )}
                        {request.status === "Cancelled" && request.cancellationReason !== null && (
                            <tr>
                                <th>Cancellation Reason</th>
                                <td>{request.cancellationReason}</td>
                            </tr>
                        )}
                        {request.documentFileId && (
                            <tr>
                                <th>Supporting Document</th>
                                <td>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleDownloadDocument(request)}
                                        disabled={actionLoading === request._id}
                                    >
                                        Download
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {request.status === "Pending" && (
                    <div>
                        <div className="actions">
                            <Button variant="success" onClick={handleApprove}>Approve</Button>
                            <Button variant="danger" onClick={handleRejectClick}>Reject</Button>
                        </div>

                        <Modal isOpen={showRejectReason} onClose={() => setShowRejectReason(false)}>
                            <div className="modal-content">
                                <h2>Reject Leave Request</h2>
                                <p>This will notify the employee. Please explain why this request is being rejected.</p>

                                <div className="form-group">
                                    <label htmlFor="rejectionReason">Reason for rejection:</label>
                                    <textarea
                                        id="rejectionReason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                </div>
                                <div className="modal-actions">
                                    <Button variant="danger" onClick={handleConfirmReject}>Confirm Rejection</Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )}
            </div>
        )
    }

    return <p>Not authorized to view this request.</p>
}

export default LeaveRequestDetails