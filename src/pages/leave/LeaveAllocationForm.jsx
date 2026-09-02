import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import * as leaveAllocationService from "../../services/leaveAllocationService"
import * as leaveTypeService from "../../services/leaveTypeService"
import * as employeeService from "../../services/employeeService"
import Button from "../../components/common/Button";

const initialState = {
    employee: "",
    leaveType: "",
    periodStart: "",
    periodEnd: "",
    daysAllocated: "",
    daysCarriedForward: "",
}

const LeaveAllocationForm = (props) => {
    const { leaveAllocationId } = useParams()
    const [formData, setFormData] = useState(initialState)
    const [employees, setEmployees] = useState([])
    const [leaveTypes, setLeaveTypes] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployees = async () => {
            const employeeData = await employeeService.getAllEmployees()
            setEmployees(employeeData)
        }

        const fetchTypes = async () => {
            const typesData = await leaveTypeService.index()
            setLeaveTypes(typesData)
        }

        const fetchAllocations = async () => {
            const allocationsData = await leaveAllocationService.index()

            if (leaveAllocationId) {
                const foundAllocation = allocationsData.find((allocation) => allocation._id === leaveAllocationId)
                if (foundAllocation) {
                    setFormData({
                        ...foundAllocation,
                        employee: foundAllocation.employee._id,
                        leaveType: foundAllocation.leaveType._id,
                        periodStart: foundAllocation.periodStart.slice(0, 10),
                        periodEnd: foundAllocation.periodEnd.slice(0, 10),
                    })
                }
            }
        }

        fetchEmployees()
        fetchTypes()
        fetchAllocations()
    }, [leaveAllocationId])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (leaveAllocationId) {
            await leaveAllocationService.update(leaveAllocationId, formData)
        } else {
            await leaveAllocationService.create(formData)
        }

        navigate("/leave/allocations")
        setFormData(initialState)
    }

    if (!["HR Officer", "HR Manager"].includes(props.user.role)) {
        return <p>Not authorized to view this page.</p>
    }

    return (
        <main>
            <h1>{leaveAllocationId ? "Edit Leave Allocation" : "Add a Leave Allocation"}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="employee">Employee</label>
                <select required name="employee" id="employee" value={formData.employee} onChange={handleChange}>
                    <option value="">Select an employee</option>
                    {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>{emp.nameEn}</option>
                    ))}
                </select>

                <label htmlFor="leaveType">Leave Type</label>
                <select required name="leaveType" id="leaveType" value={formData.leaveType} onChange={handleChange}>
                    <option value="">Select a leave type</option>
                    {leaveTypes.map((type) => (
                        <option key={type._id} value={type._id}>{type.leaveTypeName}</option>
                    ))}
                </select>

                <label htmlFor="periodStart">Period Start</label>
                <input required type="date" name="periodStart" id="periodStart" value={formData.periodStart} onChange={handleChange} />

                <label htmlFor="periodEnd">Period End</label>
                <input required type="date" name="periodEnd" id="periodEnd" value={formData.periodEnd} onChange={handleChange} />

                {leaveAllocationId && (
                    <>
                        <label htmlFor="daysAllocated">Days Allocated</label>
                        <input type="number" name="daysAllocated" id="daysAllocated" value={formData.daysAllocated} onChange={handleChange} />

                        <label htmlFor="daysCarriedForward">Days Carried Forward</label>
                        <input type="number" name="daysCarriedForward" id="daysCarriedForward" value={formData.daysCarriedForward} onChange={handleChange} />
                    </>
                )}

                <Button type="submit">Submit</Button>
            </form>
        </main>
    )
}

export default LeaveAllocationForm