import { useEffect, useState } from "react";
import { getAllDesignation, createDesignation, updateDesignation, updateDesignationStatus } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const Designations = () => {
    const [designations, setDsignations] = useState([]);

    const [formData, setFormData] = useState({
        nameEn: "",
        nameAr: "",
    });

    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmiting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const loadDesignation = async () => {
        try {
            setError("");

            const designationData = await getAllDesignation();
            setDsignations(designationData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadDesignation();
    }, []);

    const handleOpenCreate = () => {
        setSelectedDesignation(null);

        setFormData({
            nameEn: "",
            nameAr: ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = designation => {
        setSelectedDesignation(designation);

        setFormData({
            nameEn: designation.nameEn || "",
            nameAr: designation.nameAr || ""
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleChange = e => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmiting(true);
            setError("");
            setMessage("");

            if(selectedDesignation) {
                 await updateDesignation(selectedDesignation._id, formData);
                 setMessage("Designation updated successfully.");
            } else {
                await createDesignation(formData);
                setMessage("Designation created successfully.");
            }

            setIsModal(false);
            setSelectedDesignation(null);

            await loadDesignation();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmiting(false);
        }
    }

    const handleStatus = async designation => {
        try {
            setActionLoading(designation._id);
            setError("");
            setMessage("");

            await updateDesignationStatus(designation._id, !designation.isActive)

            setMessage(designation.isActive ? "Designation deactivated successfully." : "Designation activated successfully");

            await loadDesignation();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    if(isLoading) return <LoadingSpinner message="Loading designations..." />

    return(
        <div>
            <h1>Designations</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="actions page-actions">
                <Button onClick={handleOpenCreate}>Add Designation</Button>
            </div>

            {designations.length === 0 ? (
                <p>No designations found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name (English)</th>
                            <th>Name (Arabic)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {designations.map(designation => (
                            <tr key={designation._id}>
                                <td>{designation.nameEn}</td>
                                <td>{designation.nameAr || "-"}</td>

                                <td>
                                    <StatusBadge status={designation.isActive ? "Active" : "Inactive"} />
                                </td>

                                <td>
                                    <div className="actions">
                                        <Button variant="secondary" onClick={() => handleOpenEdit(designation)}>
                                            Edit
                                        </Button>

                                        <Button 
                                        variant={designation.isActive ? "danger" : "success"}
                                        onClick={() => handleStatus(designation)}
                                        disabled={actionLoading === designation._id}
                                        >
                                            {designation.isActive ? "Deactivate" : "Activate"}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                <form onSubmit={handleSubmit}>
                    <h2>
                        {selectedDesignation ? "Edit Designation" : "Add Designation"}
                    </h2>

                    <label>
                        Designation Name (English)
                        <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />
                    </label>

                    <label>
                        Designation Name (Arabic)
                        <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} />
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedDesignation ? "Save Changes" : "Add Designation"}
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

export default Designations;