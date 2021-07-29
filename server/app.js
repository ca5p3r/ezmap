const fs = require('fs');
const path = require("path");
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
var bodyParser = require('body-parser');
const saltedMd5 = require('salted-md5');
const authRouters = require('./routes/auth');
const { pgConnector, initQuerier } = require('./helpers/database');

const queries = require('./settings/queries.json');
const schema = fs.readFileSync(path.resolve(__dirname, "./assets/schema.sql")).toString();


const app = express();

let dbInitConnection = pgConnector.getConnection();
let dbError = initQuerier(dbInitConnection, queries.initDB);
if (!dbError) {
    let schemaInitConnection = pgConnector.getConnection('ezmap');
    let schemaError = initQuerier(schemaInitConnection, schema);
    if (!schemaError) {
        app.listen(9000);
    }
    else {
        console.log(schemaError);
    }
}
else {
    console.log(dbError);
}

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.send('<div><h3>Homepage</h3><p>This is the homepage endpoint for the backend server!</p></div>');
});

app.use('/auth', authRouters);

app.use((req, res) => {
    res.status(404).send('<div><h3>Not Found</h3><p>You have reached an undefined endpoint!</p></div>');
});