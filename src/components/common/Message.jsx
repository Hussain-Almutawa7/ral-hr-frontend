const Message = ({ children, type = "success" }) => {
    if (!children) return null;

    return (
        <p className={`message message-${type}`}>
            {children}
        </p>
    )
}

export default Message;