const commonUtils = require('../utils/commonUtils');

let userService;

checkDuplicateEmailorPhone = async (req, res, next) => {
    try {
        if (req.user === "student")
            userService = require('../services/studentService');
        else
            throw commonUtils.customError(404, "User doesn't exist!");

        // email
        let user = await userService.searchByEntity("email", req.body.email);
        if (user)
            throw commonUtils.customError(400, "Failed! Email is already in use!");

        // phone
        user = await userService.searchByEntity("phone", req.body.phone);
        if (user)
            throw commonUtils.customError(400, "Failed! Phone No. is already in use!");

        next();
    } catch (err) {
        if (err['isCustom'] == true) {
            response = commonUtils.generateResponse(err.status, err.msg);
        } else {
            response = commonUtils.generateResponse(500, err);
        }
        return res.status(response.statusCode).send(response);
    }
}

const verifySignUp = {
    checkDuplicateEmailorPhone
}

module.exports = verifySignUp;