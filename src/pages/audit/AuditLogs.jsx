import { useEffect, useState } from "react";

import { getAllAuditLogs } from "../../services/auditService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";

const AuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuditLogs = async () => {
            try {
                setError("");

                const data = await getAllAuditLogs();

                setAuditLogs(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadAuditLogs();
    }, []);

    const formatDateTime = date => {
        if (!date) return "-";

        return new Date(date).toLocaleString();
    }

    const formatValue = value => {
        if (value === null || value === undefined || value === "") return "-";

        return value;
    }

    if (isLoading) return <LoadingSpinner message="Loading audit logs..." />

    return (
        <div>
            <h1>Audit Logs</h1>

            <Message type="error">{error}</Message>

            {auditLogs.length === 0 ? (
                <p>No audit logs found</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Table</th>
                                <th>Action</th>
                                <th>Changed By</th>
                                <th>Role</th>
                                <th>Field</th>
                                <th>Old Value</th>
                                <th>New Value</th>
                                <th>Reason</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            {auditLogs.map(log => (
                                <tr key={log._id}>
                                    <td>{formatDateTime(log.changedAt)}</td>
                                    <td>{log.tableName}</td>
                                    <td>{log.action}</td>
                                    <td>{log.changedBy?.email || "-"}</td>
                                    <td>{log.changedBy?.role || "-"}</td>
                                    <td>{log.fieldName}</td>
                                    <td className="table-text">{formatValue(log.oldValue)}</td>
                                    <td className="table-text">{formatValue(log.newValue)}</td>
                                    <td className="table-text">{log.reason || "-"}</td>
                                    <td>{log.ipAddress || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AuditLogs;