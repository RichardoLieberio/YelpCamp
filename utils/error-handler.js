class ErrorHandler extends Error {
    constructor(statusCode = 500, message = "Internal server error", stack = "There is something wrong with the server") {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack;
    }
}

module.exports = ErrorHandler;