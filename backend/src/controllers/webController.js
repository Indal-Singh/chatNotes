const Web = require('../config/db');
const ApiResponse = require('../utils/apiResponse');
const webController = {
    createTopic: (req, res) => {
        const { name } = req.body;
        const userId = req.user.id;
        console.log(name,userId);
        Web.createTopic(name, userId, (err,rese) => {
            if (err) return ApiResponse.error(rese, 'Error creating topic');
            Web.getLastInsertId((err, row) => {
                if (err) return ApiResponse.error(rese, 'Faild To Get topic id');
                const topicId = row.id;
                let resData = {
                    topicId: topicId,
                    name: name
                }
                ApiResponse.success(res, 'Topic created successfully',resData);
            });
        });
    },
    listTopic: (req, res) => {
        const userId = req.user.id;
        Web.listTopic(userId, (err, topics) => {
            if (err) return ApiResponse.error(res, 'Error fetching topics');
            ApiResponse.success(res, topics);
        });
    }
}

module.exports = webController;