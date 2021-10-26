const model = require('mongoose').model;
const Schema = require('mongoose').Schema;

const attendanceSchema = new Schema({

    rollno: {
        type: Number, 
        required: true
    },

    date: {
        type: Date,
        required: true
    }

}, { timestamps: true });

model('attendance', attendanceSchema);

module.exports = {
    model: model('attendance'),
    schema: attendanceSchema
}