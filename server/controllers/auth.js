const saltedMd5 = require('salted-md5');
const { pgConnector } = require('../helpers/database');

const salt = 'f387d4f7781b57ac232c227fcef831d0';
const pool = pgConnector.getConnection('ezmap');

const create_user = (req, res) => {
  const hashed = saltedMd5(req.body.password, salt);
  const query = `INSERT INTO users (username, password) VALUES ('${req.body.username}', '${hashed}');`;
  pool.connect((err, client, done) => {
    if (err) {
      return res.send({ error: err.detail, success: false });
    };
    client.query(query, (err) => {
      done();
      if (err) {
        return res.send({ error: err.detail, success: false });
      }
      else {
        return res.send({ error: null, success: true });
      };
    });
  });
};

const verify_login = (req, res) => {
  console.log(req);
  res.send('User logged in!');

};

module.exports = {
  create_user,
  verify_login
};