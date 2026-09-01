import { useEffect, useState } from "react"
import * as leaveTypeService from "../../services/leaveTypeService";
import { useNavigate } from "react-router"
import formatValue from "../../utils/formatValue";

const HR_ROLES = ["HR Officer", "HR Manager"]

const LeaveTypes = (props) => {
    const [leaveTypes, setLeaveTypes] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllTypes = async () => {
            const typesData = await leaveTypeService.index()
            setLeaveTypes(typesData)
        }

        fetchAllTypes()
    }, [])

    const isHR = HR_ROLES.includes(props.user.role)

    return (
        <div>
            {isHR &&
                <div>
                    <button onClick={() => navigate(`/leave/types/new`)}>Add a Leave Type</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Leave Type</th>
                                <th>Leave Type (Arabic Name)</th>
                                <th>Max Days Per Year</th>
                                <th>Pay Fraction</th>
                                <th>Requires Service Months</th>
                                <th>Requires Document</th>
                                <th>Carry Forward</th>
                                <th>Max Carry Forward</th>
                                <th>Encashable</th>
                                <th>Counts Toward Service</th>
                                <th>Once Per Lifetime</th>
                                <th>Max Life Time Uses</th>
                                <th>Includes Holidays</th>
                                <th>Gender Restriction</th>
                                <th>Next Leave Type</th>
                                <th>Law Article</th>
                                <th>Uses Proration</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveTypes.map((type) => (
                                <tr
                                    key={type._id}
                                >
                                    <td>{formatValue(type.leaveTypeName)}</td>
                                    <td>{formatValue(type.leaveTypeNameAr)}</td>
                                    <td>{formatValue(type.maxDaysPerYear)}</td>
                                    <td>{formatValue(type.payFraction)}</td>
                                    <td>{formatValue(type.requiresServiceMonths)}</td>
                                    <td>{formatValue(type.requiresDocument)}</td>
                                    <td>{formatValue(type.carryForward)}</td>
                                    <td>{formatValue(type.maxCarryForward)}</td>
                                    <td>{formatValue(type.encashable)}</td>
                                    <td>{formatValue(type.countsTowardService)}</td>
                                    <td>{formatValue(type.oncePerLifetime)}</td>
                                    <td>{formatValue(type.maxLifeTimeUses)}</td>
                                    <td>{formatValue(type.includesHolidays)}</td>
                                    <td>{formatValue(type.genderRestriction)}</td>
                                    <td>{type.nextLeaveType ? formatValue(type.nextLeaveType.leaveTypeName) : "-"}</td>
                                    <td>{formatValue(type.lawArticle)}</td>
                                    <td>{formatValue(type.usesProration)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default LeaveTypes