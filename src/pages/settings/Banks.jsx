import { useEffect, useState } from "react";
import { getAllBanks, createBank, updateBank, updateBankStatus } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const Bank = ({ user }) => {
    const canEdit = user.role === "HR Manager";
    const [banks, setBanks] = useState([]);

    const [formData, setFormData] = useState({
        nameEn: "",
        nameAr: "",
    });

    const [selectedBank, setSelectedBank] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const loadBanks = async () => {
        try {
            setError("");

            const bankData = await getAllBanks();
            setBanks(bankData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadBanks();
    }, []);

    const handleOpenCreate = () => {
        setSelectedBank(null);

        setFormData({
            nameEn: "",
            nameAr: ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = bank => {
        setSelectedBank(bank);

        setFormData({
            nameEn: bank.nameEn || "",
            nameAr: bank.nameAr || ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            if (selectedBank) {
                await updateBank(selectedBank._id, formData);
                setMessage("Bank updated successfully.");
            } else {
                await createBank(formData);
                setMessage("Bank created successfully.");
            }

            setIsModal(false);
            setSelectedBank(null);

            await loadBanks();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleStatus = async bank => {
        try {
            setActionLoading(bank._id);
            setError("");
            setMessage("");

            await updateBankStatus(bank._id, !bank.isActive)

            setMessage(bank.isActive ? "Bank deactivated successfully." : "Bank activated successfully.");

            await loadBanks();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading banks..." />

    return (
        <div>
            <h1>Banks</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {canEdit && (
                <div className="actions">
                    <Button onClick={handleOpenCreate}>Add Bank</Button>
                </div>
            )}

            {banks.length === 0 ? (
                <p>No banks found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name (English)</th>
                            <th>Name (Arabic)</th>
                            <th>Status</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {banks.map(bank => (
                            <tr key={bank._id}>
                                <td>{bank.nameEn}</td>
                                <td>{bank.nameAr || "-"}</td>

                                <td>
                                    <StatusBadge status={bank.isActive ? "Active" : "Inactive"} />
                                </td>

                                {canEdit && (
                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleOpenEdit(bank)}>
                                                Edit
                                            </Button>

                                            <Button
                                                variant={bank.isActive ? "danger" : "success"}
                                                onClick={() => handleStatus(bank)}
                                                disabled={actionLoading === bank._id}
                                            >
                                                {bank.isActive ? "Deactivate" : "Activate"}
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
                        {selectedBank ? "Edit Bank" : "Add Bank"}
                    </h2>

                    <label>
                        Bank Name (English)
                        <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />
                    </label>

                    <label>
                        Bank Name (Arabic)
                        <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} />
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedBank ? "Save Changes" : "Add Bank"}
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

export default Bank;