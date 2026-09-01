const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
        timeZone: "Asia/Bahrain"
    });
}

export default formatDate