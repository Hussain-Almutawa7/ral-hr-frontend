import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import * as leaveRequestService from "../../services/leaveRequestService"
import Modal from "../../components/common/Modal"
import formatDate from "../../utils/formatDate"

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
        return <p>Loading...</p>
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
                <p>Reason: {request.reason}</p>
                <p>Status: {request.status}</p>

                {request.status === "Rejected" && (
                    <p>Rejection Reason: {request.rejectionReason}</p>
                )}
                {request.status === "Cancelled" && (
                    <p>Cancellation Reason: {request.cancellationReason}</p>
                )}

                {request.status === "Draft" && (
                    <button onClick={handleSubmitRequest}>Submit Request</button>
                )}

                {(request.status === "Draft" || request.status === "Pending" || request.status === "Approved") && (
                    <button onClick={handleCancelClick}>Cancel Request</button>
                )}

                <Modal isOpen={showCancelReason} onClose={() => setShowCancelReason(false)}>
                    <label htmlFor="cancellationReason">Reason for cancellation:</label>
                    <textarea
                        id="cancellationReason"
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                    />
                    <button onClick={handleConfirmCancel}>Confirm Cancellation</button>
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
                <p>Reason: {request.reason}</p>
                <p>Status: {request.status}</p>

                {request.balanceAtRequest !== null && (
                    <p>Balance At Request: {request.balanceAtRequest}</p>
                )}
                {request.status === "Rejected" && (
                    <p>Rejection Reason: {request.rejectionReason}</p>
                )}
                {request.status === "Cancelled" && (
                    <p>Cancellation Reason: {request.cancellationReason}</p>
                )}

                {request.status === "Pending" && (
                    <div>
                        <button onClick={handleApprove}>Approve</button>
                        <button onClick={handleRejectClick}>Reject</button>

                        <Modal isOpen={showRejectReason} onClose={() => setShowRejectReason(false)}>
                            <label htmlFor="rejectionReason">Reason for rejection:</label>
                            <textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <button onClick={handleConfirmReject}>Confirm Rejection</button>
                        </Modal>
                    </div>
                )}
            </div>
        )
    }

    return <p>Not authorized to view this request.</p>
}

export default LeaveRequestDetails