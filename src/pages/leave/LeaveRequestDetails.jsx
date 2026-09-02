import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import * as leaveRequestService from "../../services/leaveRequestService"
import Modal from "../../components/common/Modal"
import formatDate from "../../utils/formatDate"
import Button from "../../components/common/Button"
import LoadingSpinner from "../../components/common/LoadingSpinner"

const HR_ROLES = ["HR Officer", "HR Manager"]

const LeaveRequestDetails = (props) => {
    const { requestId } = useParams()
    const navigate = useNavigate()
    const [request, setRequest] = useState(null)
    const [showCancelReason, setShowCancelReason] = useState(false)
    const [cancellationReason, setCancellationReason] = useState('')

    const [showRejectReason, setShowRejectReason] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')

    useEffect(() => {
        const fetchRequest = async () => {
            const requestData = await leaveRequestService.show(requestId)
            setRequest(requestData)
        }
        fetchRequest()
    }, [requestId])

    const handleSubmitRequest = async () => {
        await leaveRequestService.submit(requestId)
        navigate("/leave")
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

    if (!request) {
        return <LoadingSpinner>Loading...</LoadingSpinner>
    }

    const isOwner = props.user.employee === request.employee._id
    const isReviewer = HR_ROLES.includes(props.user.role) || props.user.employee === request.approver._id

    if (isOwner) {
        return (
            <div>
                <h1>{request.leaveType.leaveTypeName}</h1>
                <p>From: {formatDate(request.fromDate)}</p>
                <p>To: {formatDate(request.toDate)}</p>
                {request.isHalfDay && (
                    <p>Half Day Date: {formatDate(request.halfDayDate)}</p>
                )}
                <p>Total Days: {request.totalDays}</p>
                {request.reason && <p>Reason: {request.reason}</p>}
                <p>Status: {request.status}</p>

                {request.status === "Rejected" && request.rejectionReason !== null && (
                    <p>Rejection Reason: {request.rejectionReason}</p>
                )}
                {request.status === "Cancelled" && request.cancellationReason !== null && (
                    <p>Cancellation Reason: {request.cancellationReason}</p>
                )}

                {request.status === "Draft" && (
                    <Button onClick={handleSubmitRequest}>Submit Request</Button>
                )}

                {(request.status === "Draft" || request.status === "Pending" || request.status === "Approved") && (
                    <Button variant="secondary" onClick={handleCancelClick}>Cancel Request</Button>
                )}

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
                <p>Employee: {request.employee.nameEn}</p>
                <p>Approver: {request.approver.nameEn}</p>
                <p>From: {formatDate(request.fromDate)}</p>
                <p>To: {formatDate(request.toDate)}</p>
                {request.isHalfDay && (
                    <p>Half Day Date: {formatDate(request.halfDayDate)}</p>
                )}
                <p>Total Days: {request.totalDays}</p>
                {request.reason && <p>Reason: {request.reason}</p>}
                <p>Status: {request.status}</p>

                {request.balanceAtRequest !== null && (
                    <p>Balance At Request: {request.balanceAtRequest}</p>
                )}
                {request.status === "Rejected" && request.rejectionReason !== null && (
                    <p>Rejection Reason: {request.rejectionReason}</p>
                )}
                {request.status === "Cancelled" && request.cancellationReason !== null && (
                    <p>Cancellation Reason: {request.cancellationReason}</p>
                )}

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