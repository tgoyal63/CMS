const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const commonUtils = require('../utils/commonUtils');
let userService;

verifyToken = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token)
            throw commonUtils.customError(403, "Access denied! No token provided.");
        result = token.split(" ");
        const decoded = await jwt.verify(result[1], config.secret);
        if (!decoded)
            throw commonUtils.customError(401, "Unauthorized!");
        req.userId = decoded.id;
        if (req.user === "student") {
            userService = require('../services/studentService');
        } else {
            throw commonUtils.customError(404, "User not found!");
        }
        const data = await userService.searchByEntity("_id", req.userId);
        if (result[1] !== data.token) {
            throw commonUtils.customError(401, "Invalid User token!");
        }
        if (data) {
            next();
        } else {
            throw commonUtils.customError(401, "Invalid User token!");
        }
    }
    catch (err) {
        if (err['isCustom'] == true) {
            response = commonUtils.generateResponse(err.status, err.msg);
        } else {
            response = commonUtils.generateResponse(500, err);
        }
        return res.status(response.statusCode).send(response);
    }
};

const jwtAuth = {
    verifyToken
}
module.exports = jwtAuth;