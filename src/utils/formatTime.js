const formatTime = (time) => {
    if (!time) return "-";

    return new Date(time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Bahrain"
    });
}

export default formatTime;