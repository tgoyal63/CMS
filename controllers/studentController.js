const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { validate, ValidationError } = require('express-validation');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const childProcess = require("child_process");
const fs = require('fs');
const exec = childProcess.execSync;

const config = require('../config/authConfig');
const verifySignUp = require('../middlewares/verifySignUp');
const jwtAuth = require('../middlewares/jwtAuth');
const student = require('../models/student');
const studentService = require('../services/studentService');
const attendanceService = require('../services/attendanceService');
const commonUtils = require('../utils/commonUtils');

const storage = multer.diskStorage({
    // destination: './public/photos/',
    destination: (req, file, cb) => {
        if (file.fieldname === "photo") {
            cb(null, './public/photos/');
        } else if (file.fieldname === "attendance") {
            cb(null, './public/attendance/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, req.body.rollno + '.jpg')
    }
});

var upload = multer({ storage: storage });

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-type, Accept"
    );
    next();
});

router.post('/signup',
    // validate(student.cvSchema, {}, {}), 
    verifySignUp.checkDuplicateEmailorPhone,
    upload.single('photo'),
    async (req, res) => {
        let response;
        try {
            // if (!commonUtils.validateEmail(req.body.email))
            //     throw commonUtils.customError(403, 'Invalid Email Address!');
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            let data = await studentService.create(req.body);
            req.body.token = jwt.sign({ id: data._id }, config.secret, {
                expiresIn: "9999 years"
            });
            data = await studentService.updateById(data.studentId, { token: req.body.token });
            response = commonUtils.generateResponse(201, 'Successful', { token: data.token });
        } catch (err) {
            if (err['isCustom'] === true) {
                response = commonUtils.generateResponse(err.status, err.msg);
            } else if (err['name'] === "MongoError" && err['code'] === 11000) {
                response = commonUtils.generateResponse(409, 'Duplicate Key error');
            } else {
                response = commonUtils.generateResponse(500, err);
            }
        }
        return res.status(response.statusCode).send(response);
    });

router.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});

router.post("/login", async (req, res) => {
    let response;
    try {
        let verify;
        if (req.body.username) {
            verify = await studentService.searchByEntity("username", req.body.username);
        } else if (req.body.email) {
            verify = await studentService.searchByEntity("email", req.body.email);
        } else if (req.body.phone) {
            verify = await studentService.searchByEntity("phone", req.body.phone);
        } else {
            throw commonUtils.customError(401, 'Please Enter Username, Email Address or Phone number!');
        }
        if (!verify) {
            throw commonUtils.customError(404, 'Student not found!');
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, verify.password);
        if (!passwordIsValid) {
            throw commonUtils.customError(401, 'Invalid Password!');
        }
        response = commonUtils.generateResponse(200, 'Successful', { token: verify.token });
    } catch (err) {
        if (err['isCustom'] == true) {
            response = commonUtils.generateResponse(err.status, err.msg);
        } else {
            response = commonUtils.generateResponse(500, err);
        }
    }
    return res.status(response.statusCode).send(response);
});

router.get("/profile", jwtAuth.verifyToken, async (req, res) => {
    let response;
    try {
        const data = await studentService.searchByEntity("_id", req.userId);
        response = commonUtils.generateResponse(200, 'Successful', data);
    } catch (err) {
        if (err['isCustom'] == true) {
            response = commonUtils.generateResponse(err.status, err.msg);
        } else {
            response = commonUtils.generateResponse(500, err);
        }
    }
    return res.status(response.statusCode).send(response);
});

router.post("/attendance", async (req, res) => {
    let response;
    try {
        const { image } = req.body;
        let base64Image = image.split(';base64,').pop();
        fs.writeFile('./public/attendance/image.png', base64Image, {encoding: 'base64'}, function(err) {
            console.log('File created', err);
        });
        const result = exec(`python3 "./python/a.py" ./attendance/image.png`);
        console.log(result);
        const rollno = result.toString();

        if (result == 0) {
            response = commonUtils.generateResponse(404, 'Face does not found in the database.');
        } else {
            const date = new Date();
            const student = await studentService.searchByEntity("rollno", rollno);
            if (!student) {
                throw commonUtils.customError(404, 'Student not found!');
            }
            const attendance = await attendanceService.create({ rollno, date });
            response = commonUtils.generateResponse(200, 'Successful', 'Attendance marked for roll no. ' + attendance.rollno);

        }

    } catch (err) {
        if (err['isCustom'] == true) {
            response = commonUtils.generateResponse(err.status, err.msg);
        } else {
            response = commonUtils.generateResponse(500, err);
        }
    }
    return res.status(response.statusCode).send(response);
});

module.exports = router;