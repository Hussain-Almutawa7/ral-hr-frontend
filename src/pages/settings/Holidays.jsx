import { useEffect, useState } from "react";
import { getAllHolidays, createHoliday, updateHoliday, getAllHolidayLists } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import Modal from "../../components/common/Modal";

import formatDate from "../../utils/formatDate";

const Holidays = ({ user }) => {
    const canEdit = user.role === "HR Manager";

    const [holidays, setHolidays] = useState([]);
    const [holidayLists, setHolidayLists] = useState([]);

    const [formData, setFormData] = useState({
        holidayList: "",
        date: "",
        description: "",
        isConfirmed: false
    });

    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadHolidays = async () => {
        try {
            setError("");

            const holidayData = await getAllHolidays();
            const holidayListData = await getAllHolidayLists();

            setHolidays(holidayData);
            setHolidayLists(holidayListData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadHolidays();
    }, []);

    const handleOpenCreate = () => {
        setSelectedHoliday(null);

        setFormData({
            holidayList: "",
            date: "",
            description: "",
            isConfirmed: false
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = holiday => {
        setSelectedHoliday(holiday);

        setFormData({
            holidayList: holiday.holidayList?._id || holiday.holidayList || "",
            date: holiday.date ? holiday.date.split("T")[0] : "",
            description: holiday.description || "",
            isConfirmed: holiday.isConfirmed ?? false
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            if (selectedHoliday) {
                await updateHoliday(selectedHoliday._id, formData);
                setMessage("Holiday updated successfully.");
            } else {
                await createHoliday(formData);
                setMessage("Holiday created successfully.");
            }

            setIsModal(false);
            setSelectedHoliday(null);

            await loadHolidays();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading holidays..." />

    return (
        <div>
            <h1>Holidays</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {canEdit && (
                <div className="actions">
                    <Button onClick={handleOpenCreate}>Add Holiday</Button>
                </div>
            )}

            {holidays.length === 0 ? (
                <p>No holidays found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Holiday List</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Confirmed</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {holidays.map(holiday => (
                            <tr key={holiday._id}>
                                <td>{holiday.holidayList?.name || "-"}</td>
                                <td>{formatDate(holiday.date)}</td>
                                <td>{holiday.description}</td>
                                <td>{holiday.isConfirmed ? "Yes" : "No"}</td>

                                {canEdit && (
                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleOpenEdit(holiday)}>
                                                Edit
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
                        {selectedHoliday ? "Edit Holiday" : "Add Holiday"}
                    </h2>

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

                    <label>
                        Date
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </label>

                    <label>
                        Description
                        <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                    </label>

                    <label>
                        <input type="checkbox" name="isConfirmed" checked={formData.isConfirmed} onChange={handleChange} />
                        Confirmed Holiday
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedHoliday ? "Save Changes" : "Add Holiday"}
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

export default Holidays;