const mongoose = require('mongoose');

const host = 'localhost';
const port = 27017;
const db_name = 'cms';
const db_pass = '';

class DBConnManager {
    constructor() { }

    connect() {
        const url = 'mongodb://' + host + ':' + port + '/' + db_name;
        return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
    }

    async safeConnect() {
        try {
            const msg = await this.connect();
            console.log('Connected to database: ' + db_name + ' at ' + host + ':' + port);
        } catch (error) {
            console.log('Connection to database failed. Error: ', error);
            console.log('Closing application');
            process.exit();
        }
    }

}
const dbConnManager = new DBConnManager();
module.exports = dbConnManager;