const getDateTimeAsInteger = () => {
    const datetime = new Date().toJSON().replace("T", "").replaceAll("-", "").replaceAll(":", "").slice(0, 14);
    return Number(datetime);
};

module.exports = {
    getDateTimeAsInteger,
};