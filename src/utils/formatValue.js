const formatValue = (value) => {
    if (value === null || value === undefined) {
        return "-"
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false"
    }
    return value
}

export default formatValue