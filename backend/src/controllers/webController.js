const Web = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const webController = {
    createTopic: (req, res) => {
        const { name } = req.body;
        const userId = req.user.id;
        Web.createTopic(name, userId, (err,res) => {
            if (err) return ApiResponse.error(res, 'Error creating topic');
            ApiResponse.success(res, 'Topic created successfully');
        });
    }
}

module.exports = webController;