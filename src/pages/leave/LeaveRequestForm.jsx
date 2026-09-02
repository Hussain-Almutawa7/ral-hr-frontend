import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as leaveTypeService from "../../services/leaveTypeService"
import * as leaveRequestService from "../../services/leaveRequestService"
import * as leaveAllocationService from "../../services/leaveAllocationService"
import * as documentService from "../../services/documentService";

import Button from "../../components/common/Button";
import Message from "../../components/common/Message";

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
    const [selectedFile, setSelectedFile] = useState(null)

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            (allocation) => allocation.leaveType._id === leaveTypeId && allocation.employee._id === props.user.employee
        )
    }

    const handleChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
        setFormData({
            ...formData,
            [event.target.name]: value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const data = new FormData();

            data.append("leaveType", formData.leaveType);
            data.append("fromDate", formData.fromDate);
            data.append("toDate", formData.toDate);
            data.append("isHalfDay", formData.isHalfDay);

            if (formData.isHalfDay && formData.halfDayDate) {
                data.append("halfDayDate", formData.halfDayDate);
            }

            if (formData.reason) {
                data.append("reason", formData.reason);
            }

            if (selectedFile) {
                data.append("file", selectedFile);
            }

            const newRequest = await leaveRequestService.create(data);

            navigate("/leave");
            setFormData(initialState);
            setSelectedFile(null);
        } catch (e) {
            setError(e.message);
        }

    }

    return (
        <main>
            <h1>Add a Request</h1>
            <form onSubmit={handleSubmit}>
                {error && <Message type="error">{error}</Message>}
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

                <div className="checkbox-label">
                    <label htmlFor="isHalfDay">Is Half Day?</label>
                    <input type="checkbox" id="isHalfDay" name="isHalfDay" onChange={handleChange} checked={!!formData.isHalfDay} />
                </div>

                <label htmlFor="halfDayDate">Half Day Date</label>
                <input
                    type="date"
                    name="halfDayDate"
                    value={formData.halfDayDate}
                    id="halfDayDate"
                    onChange={handleChange}
                />

                <label htmlFor="document">Supporting Document</label>
                <input
                    type="file"
                    name="document"
                    id="document"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                <label htmlFor="reason">Reason</label>
                <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    id="reason"
                    onChange={handleChange}
                />

                <Button type="submit">Submit Request</Button>
            </form>

        </main>
    )
}

export default LeaveRequestForm;