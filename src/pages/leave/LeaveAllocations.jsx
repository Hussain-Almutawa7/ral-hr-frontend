import { useEffect, useState } from "react"
import * as leaveTypeService from "../../services/leaveTypeService";
import * as leaveAllocationService from "../../services/leaveAllocationService"
import { useNavigate } from "react-router"
import formatValue from "../../utils/formatValue";
import formatDate from "../../utils/formatDate"
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const HR_ROLES = ["HR Officer", "HR Manager"]

const LeaveAllocations = (props) => {
    const [leaveTypes, setLeaveTypes] = useState([])
    const [leaveAllocations, setLeaveAllocations] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllTypes = async () => {
            const typesData = await leaveTypeService.index()
            setLeaveTypes(typesData)
        }

        const fetchAllAllocations = async () => {
            const allocationData = await leaveAllocationService.index()
            setLeaveAllocations(allocationData)
        }

        fetchAllTypes()
        fetchAllAllocations()
    }, [])

    const isHR = HR_ROLES.includes(props.user.role)

    if (!HR_ROLES.includes(props.user.role)) {
        return <p>Not authorized to view this page.</p>
    }

    return (
        <div>
            <h1>Leave Allocations</h1>
            <div className="actions page-actions">
                <Button variant="primary" onClick={() => navigate(`/leave/allocations/new`)}>Add a Leave Allocation</Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Period Start</th>
                        <th>Period End</th>
                        <th>Days Allocated</th>
                        <th>Days Carried Forward</th>
                        <th>Days Taken</th>
                        <th>Remaining</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveAllocations.map((allocation) => (
                        <tr key={allocation._id}>
                            <td>{formatValue(allocation.employee.nameEn)}</td>
                            <td>{formatValue(allocation.leaveType.leaveTypeName)}</td>
                            <td>{formatDate(allocation.periodStart)}</td>
                            <td>{formatDate(allocation.periodEnd)}</td>
                            <td>{formatValue(allocation.daysAllocated)}</td>
                            <td>{formatValue(allocation.daysCarriedForward)}</td>
                            <td>{formatValue(allocation.daysTaken)}</td>
                            <td>{formatValue(allocation.remainingDays)}</td>
                            <td><Button variant="secondary" onClick={() => navigate(`/leave/allocations/${allocation._id}/edit`)}>Edit</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default LeaveAllocations