import { useEffect, useState } from "react";
import { getAllShiftTypes, createShiftType, updateShiftType, updateShiftTypeStatus, getAllHolidayLists } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const ShiftTypes = ({ user }) => {
    const canEdit = user.role === "HR Manager";

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const [shiftTypes, setShiftTypes] = useState([]);
    const [holidayLists, setHolidayLists] = useState([]);

    const [formData, setFormData] = useState({
        shiftName: "",
        startTime: "",
        endTime: "",
        breakMinutes: "",
        workingDays: [],
        checkinAllowedMinutesBefore: "",
        lateGraceMinutes: "",
        earlyExitGraceMinutes: "",
        checkoutAllowedMinutesAfter: "",
        halfDayHoursThreshold: "",
        absentHoursThreshold: "",
        markLateEntry: true,
        markEarlyExit: true,
        allowOvertime: true,
        holidayList: ""
    });

    const [selectedType, setSelectedType] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const loadShiftTypes = async () => {
        try {
            setError("");

            const shiftData = await getAllShiftTypes();
            const holidayData = await getAllHolidayLists();

            setShiftTypes(shiftData);
            setHolidayLists(holidayData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadShiftTypes();
    }, []);

    const handleOpenCreate = () => {
        setSelectedType(null);

        setFormData({
            shiftName: "",
            startTime: "",
            endTime: "",
            breakMinutes: "",
            workingDays: [],
            checkinAllowedMinutesBefore: "",
            lateGraceMinutes: "",
            earlyExitGraceMinutes: "",
            checkoutAllowedMinutesAfter: "",
            halfDayHoursThreshold: "",
            absentHoursThreshold: "",
            markLateEntry: true,
            markEarlyExit: true,
            allowOvertime: true,
            holidayList: ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = type => {
        setSelectedType(type);

        setFormData({
            shiftName: type.shiftName || "",
            startTime: type.startTime || "",
            endTime: type.endTime || "",
            breakMinutes: type.breakMinutes ?? "",
            workingDays: type.workingDays || [],
            checkinAllowedMinutesBefore: type.checkinAllowedMinutesBefore ?? "",
            lateGraceMinutes: type.lateGraceMinutes ?? "",
            earlyExitGraceMinutes: type.earlyExitGraceMinutes ?? "",
            checkoutAllowedMinutesAfter: type.checkoutAllowedMinutesAfter ?? "",
            halfDayHoursThreshold: type.halfDayHoursThreshold ?? "",
            absentHoursThreshold: type.absentHoursThreshold ?? "",
            markLateEntry: type.markLateEntry ?? true,
            markEarlyExit: type.markEarlyExit ?? true,
            allowOvertime: type.allowOvertime ?? true,
            holidayList: type.holidayList?._id || type.holidayList || ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
    }

    const handleWorkingDayChange = e => {
        const day = e.target.value;

        if (e.target.checked) {
            setFormData({ ...formData, workingDays: [...formData.workingDays, day] });
        } else {
            setFormData({ ...formData, workingDays: formData.workingDays.filter(workingDay => workingDay !== day) });
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            const shiftData = {
                ...formData,
                breakMinutes: Number(formData.breakMinutes),
                checkinAllowedMinutesBefore: Number(formData.checkinAllowedMinutesBefore),
                lateGraceMinutes: Number(formData.lateGraceMinutes),
                earlyExitGraceMinutes: Number(formData.earlyExitGraceMinutes),
                checkoutAllowedMinutesAfter: Number(formData.checkoutAllowedMinutesAfter),
                halfDayHoursThreshold: Number(formData.halfDayHoursThreshold),
                absentHoursThreshold: Number(formData.absentHoursThreshold)
            };

            if (selectedType) {
                await updateShiftType(selectedType._id, shiftData);
                setMessage("Shift type updated successfully.");
            } else {
                await createShiftType(shiftData);
                setMessage("Shift type created successfully.");
            }

            setIsModal(false);
            setSelectedType(null);

            await loadShiftTypes();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleStatus = async type => {
        try {
            setActionLoading(type._id);
            setError("");
            setMessage("");

            await updateShiftTypeStatus(type._id, !type.isActive);

            setMessage(type.isActive ? "Shift type deactivated successfully." : "Shift type activated successfully.");

            await loadShiftTypes();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading shift types..." />

    return (
        <div>
            <h1>Shift Types</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {canEdit && (
                <div className="actions page-actions">
                    <Button onClick={handleOpenCreate}>Add Shift Type</Button>
                </div>
            )}

            {shiftTypes.length === 0 ? (
                <p>No shift types found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Shift Name</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Break</th>
                            <th>Working Days</th>
                            <th>Late Grace</th>
                            <th>Half Day</th>
                            <th>Absent</th>
                            <th>Overtime</th>
                            <th>Status</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {shiftTypes.map(type => (
                            <tr key={type._id}>
                                <td>{type.shiftName}</td>
                                <td>{type.startTime}</td>
                                <td>{type.endTime}</td>
                                <td>{type.breakMinutes} min</td>
                                <td>{type.workingDays?.join(", ") || "-"}</td>
                                <td>{type.lateGraceMinutes} min</td>
                                <td>{type.halfDayHoursThreshold} hrs</td>
                                <td>{type.absentHoursThreshold} hrs</td>
                                <td>{type.allowOvertime ? "Yes" : "No"}</td>

                                <td>
                                    <StatusBadge status={type.isActive ? "Active" : "Inactive"} />
                                </td>

                                {canEdit && (
                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleOpenEdit(type)}>
                                                Edit
                                            </Button>

                                            <Button
                                                variant={type.isActive ? "danger" : "success"}
                                                onClick={() => handleStatus(type)}
                                                disabled={actionLoading === type._id}
                                            >
                                                {type.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>
                        {selectedType ? "Edit Shift Type" : "Add Shift Type"}
                    </h2>

                    <label>
                        Shift Name
                        <input type="text" name="shiftName" value={formData.shiftName} onChange={handleChange} required />
                    </label>

                    <label>
                        Start Time
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                    </label>

                    <label>
                        End Time
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                    </label>

                    <label>
                        Break Minutes
                        <input type="number" name="breakMinutes" value={formData.breakMinutes} onChange={handleChange} min="0" required />
                    </label>

                    <label>
                        Check In Allowed Minutes Before
                        <input type="number" name="checkinAllowedMinutesBefore" value={formData.checkinAllowedMinutesBefore} onChange={handleChange} min="0" required />
                    </label>

                    <label>
                        Late Grace Minutes
                        <input type="number" name="lateGraceMinutes" value={formData.lateGraceMinutes} onChange={handleChange} min="0" required />
                    </label>

                    <label>
                        Early Exit Grace Minutes
                        <input type="number" name="earlyExitGraceMinutes" value={formData.earlyExitGraceMinutes} onChange={handleChange} min="0" required />
                    </label>

                    <label>
                        Check Out Allowed Minutes After
                        <input type="number" name="checkoutAllowedMinutesAfter" value={formData.checkoutAllowedMinutesAfter} onChange={handleChange} min="0" required />
                    </label>

                    <label>
                        Half Day Hours Threshold
                        <input type="number" name="halfDayHoursThreshold" value={formData.halfDayHoursThreshold} onChange={handleChange} min="0" step="0.5" required />
                    </label>

                    <label>
                        Absent Hours Threshold
                        <input type="number" name="absentHoursThreshold" value={formData.absentHoursThreshold} onChange={handleChange} min="0" step="0.5" required />
                    </label>

                    <label>
                        Holiday List
                        <select name="holidayList" value={formData.holidayList} onChange={handleChange} required>
                            <option value="">Select Holiday List</option>
                            {holidayLists.map(list => (
                                <option key={list._id} value={list._id}>
                                    {list.name} ({list.year})
                                </option>
                            ))}
                        </select>
                    </label>

                    <div>
                        <p>Working Days</p>

                        {days.map(day => (
                            <label key={day}>
                                <input type="checkbox" value={day} checked={formData.workingDays.includes(day)} onChange={handleWorkingDayChange} />
                                {day}
                            </label>
                        ))}
                    </div>

                    <label>
                        <input type="checkbox" name="markLateEntry" checked={formData.markLateEntry} onChange={handleChange} />
                        Mark Late Entry
                    </label>

                    <label>
                        <input type="checkbox" name="markEarlyExit" checked={formData.markEarlyExit} onChange={handleChange} />
                        Mark Early Exit
                    </label>

                    <label>
                        <input type="checkbox" name="allowOvertime" checked={formData.allowOvertime} onChange={handleChange} />
                        Allow Overtime
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedType ? "Save Changes" : "Add Shift Type"}
                        </Button>

                        <Button variant="secondary" onClick={() => setIsModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ShiftTypes;