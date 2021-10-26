module.exports = {
    generateResponse: (statusCode, message, data) => {
        console.log(`msg: ${message}, data: ${data}`);
        return {
            statusCode,
            message,
            data
        }
    },
    dbCustomError: (status, msg) => {
        return {
            status,
            msg,
            isCustom: true
        };
    },
    customError: (status, msg) => {
        return {
            status,
            msg,
            isCustom: true
        };
    },
    removeObjectProperties: (obj, properties) => {
        // console.log({obj, properties});
        for (let i=0; i<properties.length; i++) {
            if(obj.hasOwnProperty(properties[i])) {
                delete obj[properties[i]];
            }
        }
        console.log({obj, properties});
        return obj;
    },
    // validateEmail : (email) => {
    //     let x = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
    //     return x;
    // },
}