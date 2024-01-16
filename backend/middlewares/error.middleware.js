const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode);

    const response = {
        message: err.message,
    }

    if (process.env.NODE_ENV === "development") {
        response["stack"] = err.stack;
    }

    res.json(response);
}

module.exports = errorHandler;