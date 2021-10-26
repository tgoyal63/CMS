const commonUtils = require('../utils/commonUtils');
const attendance = require('../models/attendance').model;

module.exports = {
    create: async (data) => {
        try {
            const response = await attendance.create(data);
            return response;
        } catch (err) {
            if (err.name == 'CastError') {
                throw commonUtils.dbCustomError(403, 'Invalid Attendance Creation');
            } else throw err;
        }
    },

    searchByEntity: async (entity, entityValue) => {
        try {
            let data;
            if (entity === "_id")
                data = await student.findOne({ _id: entityValue }).exec();
            else if (entity === "studentId")
                data = await student.findOne({ studentId: entityValue }).exec();
            else
                throw commonUtils.dbCustomError(403, "Invalid Attendance Search");
            return data;
        } catch (err) {
            if (err.name == 'CastError') {
                throw commonUtils.dbCustomError(403, 'Invalid Attendance Search');
            } else throw err;
        }
    },

}