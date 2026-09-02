const formatValue = value => {
    if (value === null || value === undefined || value === "" || value === "null") return "-";

    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }

    return value;
}

export default formatValue;