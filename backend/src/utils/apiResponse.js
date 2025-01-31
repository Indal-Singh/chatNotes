class ApiResponse {
    static success(res, message, data = null) {
        return res.status(200).json({
            success: true,
            message: message,
            data: data
        });
    }

    static error(res, message, statusCode = 400) {
        return res.status(statusCode).json({
            success: false,
            message: message,
        });
    }
}

module.exports = ApiResponse;