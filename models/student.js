const model = require('mongoose').model;
const Schema = require('mongoose').Schema;
const { autoIncrement } = require('mongoose-plugin-autoinc');
const { Joi } = require('express-validation');

const studentSchema = new Schema({

    studentId: {
        type: Number,
        unique: true,
        required: [true, 'Student ID is required']
    },

    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },

    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },

    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },

    rollno: {
        type: Number,
        unique: true,
        required: [true, 'Roll No. is required']
    },

    // program: {
    //     type: String,
    //     required: [true, 'Program name is required']
    // },

    branch: {
        type: String,
        required: [true, 'Branch is required']
    },

    // section: {
    //     type: String,
    //     required: [true, 'Section is required']
    // },

    // semester: {
    //     type: Number,
    //     required: [true, 'Semester is required']
    // },

    // year: {
    //     type: Number,
    //     required: [true, 'Year is required']
    // },

    address: {
        type: String,
        required: [true, 'Address is required']
    },

    // dateOfBirth: {
    //     type: Date,
    //     required: [true, 'Date Of Birth is required']
    // },

    gender: {
        type: String,
        required: [true, 'Gender is required']
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    },

    token: {
        type: String
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },

    phone: {
        type: Number,
        unique: true,
        minlength: [10, 'Please enter a Valid Phone Number'],
        maxlength: [10, 'Please enter a Valid Phone Number'],
        required: [true, 'Phone number is required']
    },

}, { timestamps: true });

studentSchema.plugin(autoIncrement, {
    model: 'student',
    field: 'studentId',
    startAt: 1000000001
});

model('student', studentSchema);

const studentValidation = {
    body: Joi.object({
        studentId: Joi.number(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        rollno: Joi.number().required(),
        // program: Joi.string().required(),
        branch: Joi.string().required(),
        // section: Joi.string().required(),
        // semester: Joi.number().required(),
        // year: Joi.number().required(),
        address: Joi.string().required(),
        gender: Joi.string().required(),
        // dateOfBirth: Joi.date().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.number().required(),
        email: Joi.string().email().required()
    }),
}
model('studentValidation', studentValidation);

module.exports = {
    model: model('student'),
    schema: studentSchema,
    cvModel: model('studentValidation'),
    cvSchema: studentValidation
}