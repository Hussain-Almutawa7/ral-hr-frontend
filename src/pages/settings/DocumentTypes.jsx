import { useEffect, useState } from "react";
import { getAllDocumentTypes, createDocumentType, updateDocumentType, updateDocumentTypeStatus } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

const DocumentTypes = ({ user }) => {
    const canEdit = user.role === "HR Manager";

    const [documentTypes, setDocumentTypes] = useState([]);

    const [formData, setFormData] = useState({
        code: "",
        nameEn: "",
        nameAr: "",
        hasExpiry: false
    });

    const [selectedType, setSelectedType] = useState(null);
    const [isModal, setIsModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const loadDocumentTypes = async () => {
        try {
            setError("");

            const typeData = await getAllDocumentTypes();
            setDocumentTypes(typeData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadDocumentTypes();
    }, []);

    const handleOpenCreate = () => {
        setSelectedType(null);

        setFormData({
            code: "",
            nameEn: "",
            nameAr: "",
            hasExpiry: false
        });

        setError("");
        setMessage("");
        setIsModal(true);
    }

    const handleOpenEdit = type => {
        setSelectedType(type);

        setFormData({
            code: type.code || "",
            nameEn: type.nameEn || "",
            nameAr: type.nameAr || "",
            hasExpiry: type.hasExpiry || false
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

            if (selectedType) {
                await updateDocumentType(selectedType._id, formData);
                setMessage("Document type updated successfully.");
            } else {
                await createDocumentType(formData);
                setMessage("Document type created successfully.");
            }

            setIsModal(false);
            setSelectedType(null);

            await loadDocumentTypes();
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

            await updateDocumentTypeStatus(type._id, !type.isActive)

            setMessage(type.isActive ? "Document type deactivated successfully." : "Document type activated successfully.");

            await loadDocumentTypes();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    if (isLoading) return <LoadingSpinner message="Loading document types..." />

    return (
        <div>
            <h1>Document Types</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            {canEdit && (
                <div className="actions page-actions">
                    <Button onClick={handleOpenCreate}>Add Document Type</Button>
                </div>
            )}

            {documentTypes.length === 0 ? (
                <p>No document types found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name (English)</th>
                            <th>Name (Arabic)</th>
                            <th>Expiry Required</th>
                            <th>Status</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {documentTypes.map(type => (
                            <tr key={type._id}>
                                <td>{type.code}</td>
                                <td>{type.nameEn}</td>
                                <td>{type.nameAr || "-"}</td>
                                <td>{type.hasExpiry ? "Yes" : "No"}</td>

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
                        {selectedType ? "Edit Document Type" : "Add Document Type"}
                    </h2>

                    <label>
                        Code
                        <input type="text" name="code" value={formData.code} onChange={handleChange} required />
                    </label>

                    <label>
                        Document Type Name (English)
                        <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />
                    </label>

                    <label>
                        Document Type Name (Arabic)
                        <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} />
                    </label>

                    <label className="checkbox-label">
                        <input type="checkbox" name="hasExpiry" checked={formData.hasExpiry} onChange={handleChange} />
                        Has Expiry Date
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : selectedType ? "Save Changes" : "Add Document Type"}
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

export default DocumentTypes;