const commonUtils = require('../utils/commonUtils');
const student = require('../models/student').model;

module.exports = {
    create: async (data) => {
        try {
            const response = await student.create(data);
            return response;
        } catch (err) {
            if (err.name == 'CastError') {
                throw commonUtils.dbCustomError(403, 'Invalid Student Creation');
            } else throw err;
        }
    },

    searchAll: async () => {
        try {
            const data = await student.find().exec();
            return data;
        } catch (err) {
            if (err.name == 'CastError') {
                throw commonUtils.dbCustomError(403, 'Invalid Student Search');
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
            else if (entity === "rollno")
                data = await student.findOne({ rollno: entityValue }).exec();
            else if (entity === "username")
                data = await student.findOne({ username: entityValue }).exec();
            else if (entity === "email") {
                // if (commonUtils.validateEmail(entityValue))
                    data = await student.findOne({ email: entityValue }).exec();
                // else
                //     throw commonUtils.dbCustomError(403, "Invalid E-mail Address");
            } else if (entity === "phone") {
                data = await student.findOne({ phone: entityValue }).exec();
            } else {
                throw commonUtils.dbCustomError(403, "Invalid Student Search");
            }
            return data;
        } catch (err) {
            if (err.name == 'CastError') {
                throw commonUtils.dbCustomError(403, 'Invalid Student Search');
            } else throw err;
        }
    },

    updateById: async (studentId, body) => {
        try {
            const data = await student.findOneAndUpdate({ studentId }, body, { new: true }).exec();
            return data;
        } catch (err) {
            if (err.name == 'CastError') {
                throw commonUtils.dbCustomError(403, 'Invalid Student Updation');
            } else throw err;
        }
    }
}