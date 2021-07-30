const fs = require('fs');
const path = require("path");
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
var bodyParser = require('body-parser');
const authRouters = require('./routes/auth');
const { pgConnector, initQuerier } = require('./helpers/database');

const queries = require('./settings/queries.json');
const schema = fs.readFileSync(path.resolve(__dirname, "./assets/schema.sql")).toString();


const app = express();

let dbInitConnection = pgConnector.getConnection();
let dbError = initQuerier(dbInitConnection, queries.initDB);
if (!dbError) {
    dbInitConnection.end();
    let schemaInitConnection = pgConnector.getConnection('ezmap');
    let schemaError = initQuerier(schemaInitConnection, schema);
    if (!schemaError) {
        schemaInitConnection.end();
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

app.get('/', (_, res) => {
    res.send('<div><h3>Homepage</h3><p>This is the homepage endpoint for the backend server!</p></div>');
});

app.use('/auth', authRouters);

app.use((_, res) => {
    res.status(404).send('<div><h3>Not Found</h3><p>You have reached an undefined endpoint!</p></div>');
});