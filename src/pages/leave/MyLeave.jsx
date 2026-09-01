import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import * as leaveRequestService from '../../services/leaveRequestService'
import * as leaveTypeService from "../../services/leaveTypeService";
import * as leaveAllocationService from "../../services/leaveAllocationService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const HR_ROLES = ["HR Officer", "HR Manager"]

const MyLeave = (props) => {
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
    const canSeeActionsColumn = isHR || props.user.role === "Manager"

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
            <button onClick={() => navigate(`/leave/new`)}>Request a Leave</button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {isHR && <TableCell>Employee Name</TableCell>}
                            <TableCell>Leave Type</TableCell>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                            <TableCell>Total Days</TableCell>
                            <TableCell>Status</TableCell>
                            {canSeeActionsColumn && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaveRequests.map((request) => (
                            <TableRow
                                key={request._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', }}
                                onClick={() => navigate(`/leave/${request._id}`)}
                            >
                                {isHR && <TableCell>{request.employee.nameEn}</TableCell>}
                                <TableCell component="th" scope="row">{request.leaveType.leaveTypeName}</TableCell>
                                <TableCell>{new Date(request.fromDate).toDateString()}</TableCell>
                                <TableCell>{new Date(request.toDate).toDateString()}</TableCell>
                                <TableCell>{request.totalDays}</TableCell>
                                <TableCell>{request.status}</TableCell>
                                {canSeeActionsColumn && (
                                    <TableCell>
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
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};

export default MyLeave;