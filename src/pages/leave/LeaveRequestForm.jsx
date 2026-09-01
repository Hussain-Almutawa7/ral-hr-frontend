import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as leaveTypeService from "../../services/leaveTypeService"
import * as leaveRequestService from "../../services/leaveRequestService"
import * as leaveAllocationService from "../../services/leaveAllocationService"

const initialState = {
    leaveType: "",
    fromDate: "",
    toDate: "",
    isHalfDay: false,
    halfDayDate: "",
    reason: "",
}

const LeaveRequestForm = (props) => {
    const [formData, setFormData] = useState(initialState)
    const [leaveTypes, setLeaveTypes] = useState([])
    const [allocations, setAllocations] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllTypes = async () => {
            const leaveTypesData = await leaveTypeService.index()
            setLeaveTypes(leaveTypesData)
        }

        const fetchAllAllocations = async () => {
            const allocationsData = await leaveAllocationService.index()
            setAllocations(allocationsData)
        }

        fetchAllTypes()
        fetchAllAllocations()
    }, [])

    const findAllocationForType = (leaveTypeId) => {
        return allocations.find(
            (allocation) => allocation.leaveType === leaveTypeId && allocation.employee === props.user.employee
        )
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newRequest = await leaveRequestService.create(formData);
        navigate("/leave")
        setFormData(initialState)
    }

    return (
        <main>
            <h1>Add a Request</h1>
            <form onSubmit={handleSubmit}>
                <select name="leaveType" id="leaveType" required value={formData.leaveType} onChange={handleChange}>
                    <option value="">Select a leave type</option>
                    {leaveTypes.map((type) => {
                        const allocation = findAllocationForType(type._id)
                        const balance = allocation ? `${allocation.remainingDays} days left` : "Not yet allocated"

                        return (
                            <option key={type._id} value={type._id}>
                                {type.leaveTypeName} -- {balance}
                            </option>
                        )
                    })}
                </select>

                <label htmlFor="fromDate">From Date</label>
                <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    id="fromDate"
                    onChange={handleChange}
                />

                <label htmlFor="toDate">To Date</label>
                <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    id="toDate"
                    onChange={handleChange}
                />

                <label htmlFor="isHalfDay">Is Half Day?</label>
                <input type="checkbox" id="isHalfDay" name="isHalfDay" onChange={handleChange} />

                <label htmlFor="halfDayDate">Is Half Day?</label>
                <input
                    type="date"
                    name="halfDayDate"
                    value={formData.halfDayDate}
                    id="halfDayDate"
                    onChange={handleChange}
                />

                <label htmlFor="reason">Reason</label>
                <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    id="reason"
                    onChange={handleChange}
                />

                <button type="submit">Submit Request</button>
            </form>

        </main>
    )
}

export default LeaveRequestForm;