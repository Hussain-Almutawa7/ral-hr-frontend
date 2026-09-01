function LoadingSpinner({ message = "Loading...", compact = false }) {
    return (
        <div
            className={`loading-state${compact ? " loading-state-compact" : ""}`}
            role="status"
            aria-live="polite"
        >
            <span className="loading-spinner" aria-hidden="true"></span>
            <p>{message}</p>
        </div>
    );
}

export default LoadingSpinner;