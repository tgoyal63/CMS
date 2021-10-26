const express = require('express');
const cors = require('cors');
const path = require('path');

const dbConnManager = require('./utils/dbConnManager');
const studentController = require('./controllers/studentController');

const app = express();
const port = parseInt(process.env.MAIN_PORT) || 4000;

app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/app/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/app', 'main.html'));
});

//Student APIs
app.use('/student', (req, res, next) => {
    req.user = "student";
    next();
}, studentController);

dbConnManager.safeConnect().then(() => {
    app.listen(port, () => console.log('Webservice listening on port: ' + port));
});