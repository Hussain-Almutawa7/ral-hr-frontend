import { useEffect, useState } from "react";
import { getAllHolidayLists, createHolidayList, updateHolidayList } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import Modal from "../../components/common/Modal";

const HolidayLists = ({ user }) => {
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

    const [holidayLists, setHolidayLists] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        year: "",
        weeklyOffDays: []
    });

    const [selectedList, setSelectedList] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadHolidayLists = async () => {
        try {
            setError("");

            const listData = await getAllHolidayLists();
            setHolidayLists(listData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadHolidayLists();
    }, []);

    const handleOpenCreate = () => {
        setSelectedList(null);

        setFormData({
            name: "",
            year: "",
            weeklyOffDays: []
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = list => {
        setSelectedList(list);

        setFormData({
            name: list.name || "",
            year: list.year ?? "",
            weeklyOffDays: list.weeklyOffDays || []
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleWeeklyOffDayChange = e => {
        const day = e.target.value;

        if (e.target.checked) {
            setFormData({ ...formData, weeklyOffDays: [...formData.weeklyOffDays, day] });
        } else {
            setFormData({ ...formData, weeklyOffDays: formData.weeklyOffDays.filter(weeklyOffDay => weeklyOffDay !== day) });
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            const listData = { ...formData, year: Number(formData.year) };

            if (selectedList) {
                await updateHolidayList(selectedList._id, listData);
                setMessage("Holiday list updated successfully.");
            } else {
                await createHolidayList(listData);
                setMessage("Holiday list created successfully.");
            }

            setIsModal(false);
            setSelectedList(null);

            await loadHolidayLists();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading holiday lists..." />

    return (
        <div>
            <h1>Holiday Lists</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {canEdit && (
                <div className="actions page-actions">
                    <Button onClick={handleOpenCreate}>Add Holiday List</Button>
                </div>
            )}

            {holidayLists.length === 0 ? (
                <p>No holiday lists found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Year</th>
                            <th>Weekly Off Days</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {holidayLists.map(list => (
                            <tr key={list._id}>
                                <td>{list.name}</td>
                                <td>{list.year}</td>
                                <td>{list.weeklyOffDays?.join(", ") || "-"}</td>

                                {canEdit && (
                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleOpenEdit(list)}>
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
                        {selectedList ? "Edit Holiday List" : "Add Holiday List"}
                    </h2>

                    <label>
                        Holiday List Name
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </label>

                    <label>
                        Year
                        <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                    </label>

                    <div>
                        <p>Weekly Off Days</p>

                        {days.map(day => (
                            <label key={day}>
                                <input type="checkbox" value={day} checked={formData.weeklyOffDays.includes(day)} onChange={handleWeeklyOffDayChange} />
                                {day}
                            </label>
                        ))}
                    </div>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedList ? "Save Changes" : "Add Holiday List"}
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

export default HolidayLists;