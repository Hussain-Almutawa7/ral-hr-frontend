import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import * as leaveTypeService from "../../services/leaveTypeService"

const HR_ROLES = ["HR Officer", "HR Manager"]

const initialState = {
    leaveTypeName: "",
    leaveTypeNameAr: "",
    maxDaysPerYear: "",
    payFraction: "",
    requiresServiceMonths: "",
    requiresDocument: false,
    carryForward: false,
    maxCarryForward: "",
    encashable: false,
    countsTowardService: false,
    oncePerLifetime: false,
    maxLifeTimeUses: "",
    includesHolidays: false,
    genderRestriction: "",
    nextLeaveType: "",
    lawArticle: "",
    usesProration: false,
}

const LeaveTypeForm = (props) => {
    const [formData, setFormData] = useState(initialState)
    const [leaveTypes, setLeaveTypes] = useState([])
    const { leaveTypeId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllTypes = async () => {
            const typesData = await leaveTypeService.index()
            setLeaveTypes(typesData)

            if (leaveTypeId) {
                const foundType = typesData.find((type) => type._id === leaveTypeId)
                if (foundType) {
                    setFormData(foundType)
                }
            }
        }
        fetchAllTypes()
    }, [leaveTypeId])

    if (!HR_ROLES.includes(props.user.role)) {
        return <p>Not authorized to view this page.</p>
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

        if (leaveTypeId) {
            await leaveTypeService.update(leaveTypeId, formData)
        } else {
            await leaveTypeService.create(formData)
        }

        navigate("/leave/types")
        setFormData(initialState)
    }

    return (
        <main>
            <h1>Add Request Type</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="leaveTypeName">Leave Type Name</label>
                <input required type="text" name="leaveTypeName" id="leaveTypeName" value={formData.leaveTypeName} onChange={handleChange} />

                <label htmlFor="leaveTypeNameAr">Leave Type Name (Arabic)</label>
                <input type="text" name="leaveTypeNameAr" id="leaveTypeNameAr" value={formData.leaveTypeNameAr || ''} onChange={handleChange} />

                <label htmlFor="maxDaysPerYear">Max Days Per Year</label>
                <input required type="number" name="maxDaysPerYear" id="maxDaysPerYear" value={formData.maxDaysPerYear} onChange={handleChange} />

                <label htmlFor="payFraction">Pay Fraction (0 to 1)</label>
                <input required type="number" step="0.1" min="0" max="1" name="payFraction" id="payFraction" value={formData.payFraction} onChange={handleChange} />

                <label htmlFor="requiresServiceMonths">Requires Service Months</label>
                <input type="number" name="requiresServiceMonths" id="requiresServiceMonths" value={formData.requiresServiceMonths || ''} onChange={handleChange} />

                <label htmlFor="requiresDocument">Requires Document?</label>
                <input type="checkbox" name="requiresDocument" id="requiresDocument" onChange={handleChange} checked={!!formData.requiresDocument} />

                <label htmlFor="carryForward">Carry Forward?</label>
                <input type="checkbox" name="carryForward" id="carryForward" onChange={handleChange} checked={!!formData.carryForward} />

                <label htmlFor="maxCarryForward">Max Carry Forward</label>
                <input type="number" name="maxCarryForward" id="maxCarryForward" value={formData.maxCarryForward || ''} onChange={handleChange} />

                <label htmlFor="encashable">Encashable?</label>
                <input type="checkbox" name="encashable" id="encashable" onChange={handleChange} checked={!!formData.encashable} />

                <label htmlFor="countsTowardService">Counts Toward Service?</label>
                <input type="checkbox" name="countsTowardService" id="countsTowardService" onChange={handleChange} checked={!!formData.countsTowardService} />

                <label htmlFor="oncePerLifetime">Once Per Lifetime?</label>
                <input type="checkbox" name="oncePerLifetime" id="oncePerLifetime" onChange={handleChange} checked={!!formData.oncePerLifetime} />

                <label htmlFor="maxLifeTimeUses">Max Lifetime Uses</label>
                <input type="number" name="maxLifeTimeUses" id="maxLifeTimeUses" value={formData.maxLifeTimeUses || ''} onChange={handleChange} />

                <label htmlFor="includesHolidays">Includes Holidays?</label>
                <input type="checkbox" name="includesHolidays" id="includesHolidays" onChange={handleChange} checked={!!formData.includesHolidays} />

                <label htmlFor="genderRestriction">Gender Restriction</label>
                <select name="genderRestriction" id="genderRestriction" value={formData.genderRestriction || ''} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label htmlFor="nextLeaveType">Next Leave Type (rollover)</label>
                <select name="nextLeaveType" id="nextLeaveType" value={formData.nextLeaveType || ''} onChange={handleChange}>
                    <option value="">None</option>
                    {leaveTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                            {type.leaveTypeName}
                        </option>
                    ))}
                </select>

                <label htmlFor="lawArticle">Law Article</label>
                <input type="text" name="lawArticle" id="lawArticle" value={formData.lawArticle || ''} onChange={handleChange} />

                <label htmlFor="usesProration">Uses Proration?</label>
                <input type="checkbox" name="usesProration" id="usesProration" onChange={handleChange} checked={!!formData.usesProration} />

                <button type="submit">Submit</button>
            </form>
        </main>
    )
}

export default LeaveTypeForm