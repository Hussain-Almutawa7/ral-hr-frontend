import { useEffect, useState } from "react";
import {
    getAllDocuments,
    uploadDocument,
    verifyDocument,
    rejectDocument,
    archiveDocument,
    downloadDocument
} from "../../services/documentService";

import { getAllDocumentTypes } from "../../services/settingsService";
import { getAllEmployees } from "../../services/employeeService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

import formatDate from "../../utils/formatDate";

const Documents = ({ user }) => {
    const isHR = ["HR Officer", "HR Manager"].includes(user.role);

    const [documents, setDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        employee: "",
        documentType: "",
        documentNumber: "",
        issueDate: "",
        expiryDate: "",
        file: null
    });

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const [isUploadModal, setIsUploadModal] = useState(false);
    const [isRejectModal, setIsRejectModal] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const selectedType = documentTypes.find(type => type._id === formData.documentType);

    const loadDocuments = async () => {
        try {
            setError("");

            const documentData = await getAllDocuments();
            const typeData = await getAllDocumentTypes();

            setDocuments(documentData);
            setDocumentTypes(typeData);

            if (isHR) {
                const employeeData = await getAllEmployees();
                setEmployees(employeeData);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    const handleOpenUpload = () => {
        setFormData({
            employee: "",
            documentType: "",
            documentNumber: "",
            issueDate: "",
            expiryDate: "",
            file: null
        });

        setError("");
        setMessage("");
        setIsUploadModal(true);
    }

    const handleChange = e => {
        setFormData({ ...formData,  [e.target.name]: e.target.value});
    }

    const handleFileChange = e => {
        setFormData({  ...formData,  file: e.target.files[0] || null });
    }

    const handleUpload = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            const data = new FormData();

            data.append("documentType", formData.documentType);
            data.append("documentNumber", formData.documentNumber);
            data.append("issueDate", formData.issueDate);

            if (formData.expiryDate) {
                data.append("expiryDate", formData.expiryDate);
            }

            if (isHR && formData.employee) {
                data.append("employee", formData.employee);
            }

            data.append("file", formData.file);

            await uploadDocument(data);

            setMessage("Document uploaded successfully.");
            setIsUploadModal(false);

            await loadDocuments();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleVerify = async documentId => {
        try {
            setActionLoading(documentId);
            setError("");
            setMessage("");

            await verifyDocument(documentId);

            setMessage("Document verified successfully.");

            await loadDocuments();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const handleOpenReject = document => {
        setSelectedDocument(document);
        setRejectionReason("");

        setError("");
        setMessage("");
        setIsRejectModal(true);
    }

    const handleReject = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            await rejectDocument(selectedDocument._id, rejectionReason);

            setMessage("Document rejected successfully.");

            setIsRejectModal(false);
            setSelectedDocument(null);
            setRejectionReason("");

            await loadDocuments();
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleArchive = async documentId => {
        try {
            setActionLoading(documentId);
            setError("");
            setMessage("");

            await archiveDocument(documentId);

            setMessage("Document archived successfully.");

            await loadDocuments();
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const handleDownload = async document => {
        try {
            setActionLoading(document._id);
            setError("");
            setMessage("");

            await downloadDocument(document._id, document.fileName);
        } catch (e) {
            setError(e.message);
        } finally {
            setActionLoading(null);
        }
    }

    const getDocumentTypeName = documentType => {
        if (!documentType) return "-";

        if (documentType.nameEn) {
            return documentType.nameEn;
        }

        const typeCode = documentType.code || documentType;

        const foundType = documentTypes.find(type =>
            type.code === typeCode || type._id === typeCode
        );

        return foundType?.nameEn || typeCode;
    }

    if (isLoading) return <LoadingSpinner message="Loading documents..." />

    return (
        <div>
            <h1>Documents</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <div className="actions page-actions">
                <Button onClick={handleOpenUpload}>
                    Upload Document
                </Button>
            </div>

            {documents.length === 0 ? (
                <p>No documents found</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                {isHR && <th>Employee</th>}
                                <th>Document Type</th>
                                <th>Document Number</th>
                                <th>Issue Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Rejection Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {documents.map(document => (
                                <tr key={document._id}>
                                    {isHR && (
                                        <td>{document.employee?.nameEn || "-"}</td>
                                    )}

                                    <td>{getDocumentTypeName(document.documentType)}</td>
                                    <td>{document.documentNumber || "-"}</td>
                                    <td>{document.issueDate ? formatDate(document.issueDate) : "-"}</td>
                                    <td>{document.expiryDate ? formatDate(document.expiryDate) : "-"}</td>

                                    <td>
                                        <StatusBadge status={document.status} />
                                    </td>

                                    <td className="table-text">  {document.rejectionReason || "-"} </td>

                                    <td>
                                        <div className="actions">
                                            <Button variant="secondary" onClick={() => handleDownload(document)} disabled={actionLoading === document._id}>
                                                Download
                                            </Button>

                                            {isHR && document.status === "Pending" && (
                                                <>
                                                    <Button variant="success" onClick={() => handleVerify(document._id)} disabled={actionLoading === document._id}>
                                                        Verify
                                                    </Button>

                                                    <Button variant="danger" onClick={() => handleOpenReject(document)} disabled={actionLoading === document._id}>
                                                        Reject
                                                    </Button>
                                                </>
                                            )}

                                            {isHR && (
                                                <Button variant="secondary" onClick={() => handleArchive(document._id)} disabled={actionLoading === document._id} >
                                                    Archive
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isUploadModal} onClose={() => setIsUploadModal(false)}>
                <form onSubmit={handleUpload}>
                    <h2>Upload Document</h2>

                    {isHR && (
                        <label htmlFor="employee">
                            Employee
                            <select id="employee" name="employee" value={formData.employee} onChange={handleChange} required>
                                <option value="">Select Employee</option>

                                {employees.map(employee => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.employeeCode} - {employee.nameEn}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    <label htmlFor="documentType">
                        Document Type
                        <select id="documentType" name="documentType" value={formData.documentType} onChange={handleChange} required>
                            <option value="">Select Document Type</option>

                            {documentTypes .filter(type => type.isActive) .map(type => (
                                    <option key={type._id} value={type._id}>
                                        {type.nameEn}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label htmlFor="documentNumber">
                        Document Number
                        <input id="documentNumber" name="documentNumber" type="text" value={formData.documentNumber} onChange={handleChange} required />
                    </label>

                    <label htmlFor="issueDate">
                        Issue Date
                        <input id="issueDate" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} required />
                    </label>

                    {selectedType?.hasExpiry && (
                        <label htmlFor="expiryDate">
                            Expiry Date
                            <input id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required />
                        </label>
                    )}

                    <label htmlFor="file">
                        File
                        <input id="file" name="file" type="file" onChange={handleFileChange} required />
                    </label>

                    <div className="actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Uploading..." : "Upload"}
                        </Button>

                        <Button variant="secondary" onClick={() => setIsUploadModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isRejectModal} onClose={() => setIsRejectModal(false)}>
                <form onSubmit={handleReject}>
                    <h2>Reject Document</h2>

                    <label htmlFor="rejectionReason">
                        Rejection Reason
                        <textarea  id="rejectionReason"
                            name="rejectionReason"
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            required
                        />
                    </label>

                    <div className="actions">
                        <Button type="submit" variant="danger" disabled={isSubmitting}>
                            {isSubmitting ? "Rejecting..." : "Reject"}
                        </Button>

                        <Button variant="secondary" onClick={() => setIsRejectModal(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Documents;