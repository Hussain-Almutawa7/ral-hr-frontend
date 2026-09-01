const StatusBadge = ({ status }) => {
    if (!status) return <span>-</span>;

    const statusClass = status.toLowerCase().replaceAll(" ", "-");

    return (
        <span className={`status-badge status-${statusClass}`}>
            {status}
        </span>
    )
}

export default StatusBadge;