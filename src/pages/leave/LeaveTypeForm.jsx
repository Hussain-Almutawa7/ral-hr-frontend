import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as leaveTypeService from "../../services/leaveTypeService"

const initialState = {
    leaveTypeName: "",
    leaveTypeNameAr: "",
    maxDaysPerYear: "",
    payFraction: "",
    requiresServiceMonths: "",
    requiresDocument: "",
    carryForward: "",
    maxCarryForward: "",
    encashable: "",
    countsTowardService: "",
    oncePerLifetime: "",
    maxLifeTimeUses: "",
    includesHolidays: "",
    genderRestriction: "",
    nextLeaveType: "",
    lawArticle: "",
    usesProration: "",
}

const LeaveTypeForm = (props) => {
    const [formData, setFormData] = useState(initialState)
    const [leaveTypes, setLeaveTypes] = useState([])

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newType = await leaveTypeService.create(formData);
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
                <input type="checkbox" name="requiresDocument" id="requiresDocument" onChange={handleChange} />

                <label htmlFor="carryForward">Carry Forward?</label>
                <input type="checkbox" name="carryForward" id="carryForward" onChange={handleChange} />

                <label htmlFor="maxCarryForward">Max Carry Forward</label>
                <input type="number" name="maxCarryForward" id="maxCarryForward" value={formData.maxCarryForward || ''} onChange={handleChange} />

                <label htmlFor="encashable">Encashable?</label>
                <input type="checkbox" name="encashable" id="encashable" onChange={handleChange} />

                <label htmlFor="countsTowardService">Counts Toward Service?</label>
                <input type="checkbox" name="countsTowardService" id="countsTowardService" onChange={handleChange} />

                <label htmlFor="oncePerLifetime">Once Per Lifetime?</label>
                <input type="checkbox" name="oncePerLifetime" id="oncePerLifetime" onChange={handleChange} />

                <label htmlFor="maxLifeTimeUses">Max Lifetime Uses</label>
                <input type="number" name="maxLifeTimeUses" id="maxLifeTimeUses" value={formData.maxLifeTimeUses || ''} onChange={handleChange} />

                <label htmlFor="includesHolidays">Includes Holidays?</label>
                <input type="checkbox" name="includesHolidays" id="includesHolidays" onChange={handleChange} />

                <label htmlFor="genderRestriction">Gender Restriction</label>
                <select name="genderRestriction" id="genderRestriction" value={formData.genderRestriction || ''} onChange={handleChange}>
                    <option value="">None</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label htmlFor="lawArticle">Law Article</label>
                <input type="text" name="lawArticle" id="lawArticle" value={formData.lawArticle || ''} onChange={handleChange} />

                <label htmlFor="usesProration">Uses Proration?</label>
                <input type="checkbox" name="usesProration" id="usesProration" onChange={handleChange} />

                <button type="submit">Submit</button>
            </form>
        </main>
    )
}

export default LeaveTypeForm