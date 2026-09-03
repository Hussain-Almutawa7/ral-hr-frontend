import { useEffect, useState } from "react";

import { getAllAuditLogs } from "../../services/auditService";
import formatValue from "../../utils/formatValue";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";

const AuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [tableFilter, setTableFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");

    const tableNames = [...new Set(auditLogs.map(log => log.tableName))];

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

    const filteredAuditLogs = auditLogs.filter(log => {
        const matchesSearch = log.changedBy?.email?.toLowerCase().includes(search.toLowerCase());
        const matchesTable = tableFilter === "" || log.tableName === tableFilter;
        const matchesAction = actionFilter === "" || log.action === actionFilter;

        return matchesSearch && matchesTable && matchesAction;
    });

    if (isLoading) return <LoadingSpinner message="Loading audit logs..." />

    return (
        <div>
            <h1>Audit Logs</h1>

            <Message type="error">{error}</Message>

            <div className="filters">
                <div className="filter-field">
                    <label htmlFor="auditSearch">Changed By</label>
                    <input
                        id="auditSearch"
                        type="text"
                        placeholder="Search email"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-field">
                    <label htmlFor="tableFilter">Table</label>

                    <select id="tableFilter" value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
                        <option value="">All Tables</option>

                        {tableNames.map(tableName => (
                            <option key={tableName} value={tableName}>
                                {tableName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="actionFilter">Action</label>

                    <select id="actionFilter" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
                        <option value="">All Actions</option>
                        <option value="Create">Create</option>
                        <option value="Update">Update</option>
                        <option value="Approve">Approve</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Correct">Correct</option>
                        <option value="Reject">Reject</option>
                        <option value="Password Reset">Password Reset</option>
                    </select>
                </div>

                <Button variant="secondary" onClick={() => { setSearch(""); setTableFilter(""); setActionFilter(""); }}>
                    Clear Filters
                </Button>
            </div>

            {filteredAuditLogs.length === 0 ? (
                <p>No audit logs match the selected filters.</p>
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
                            {filteredAuditLogs.map(log => (
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