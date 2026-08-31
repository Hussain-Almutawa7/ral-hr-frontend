import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as leaveTypeService from "../../services/leaveTypeService"
import * as leaveRequestService from "../../services/leaveRequestService"

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
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllTypes = async () => {
            const leaveTypesData = await leaveTypeService.index()
            setLeaveTypes(leaveTypesData)
        }
        fetchAllTypes()
    }, [])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            // [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newRequest = await leaveRequestService.create(formData);
        // navigate(`/leave/${newRequest._id}`);
        navigate("/leave");
        setFormData(initialState)
    }

    return (
        <main>
            <h1>Add a Request</h1>
            <form onSubmit={handleSubmit}>
                <select name="leaveType" id="leaveType" required value={formData.leaveType} onChange={handleChange}>
                    <option value="">Select a leave type</option>
                    {leaveTypes.map((type) => {
                        return (
                            <option key={type._id} value={type._id}>
                                {type.leaveTypeName}
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
                {formData.isHalfDay ? (
                    <input type="checkbox" id="isHalfDay" name="isHalfDay" checked onChange={handleChange} />
                ) : (
                    <input type="checkbox" id="isHalfDay" name="isHalfDay" onChange={handleChange} />
                )}

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