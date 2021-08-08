const fs = require('fs');
const path = require("path");
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
var bodyParser = require('body-parser');
const authRouters = require('./routes/auth');
const { pool } = require('./helpers/database');

const schema = fs.readFileSync(path.resolve(__dirname, "./assets/schema.sql")).toString();


const app = express();

pool.connect((err, client, done) => {
    if (err) return done(err);
    client.query(schema, (err) => {
        done();
        if (err) console.log(err);
        else {
            app.listen(9000);
        };
    });
});

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