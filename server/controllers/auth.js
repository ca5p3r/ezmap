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
        if (err.code === '23505') {
          return res.send({ error: 'User already exists', success: false });
        }
        else {
          return res.send({ error: err.detail, success: false });
        }
      }
      else {
        return res.send({ error: null, success: true });
      };
    });
  });
};

const verify_login = (req, res) => {
  const query = `SELECT id, password FROM users WHERE username = '${req.body.username}';`;
  pool.connect((err, client, done) => {
    if (err) {
      return res.send({ error: err.detail, success: false });
    };
    client.query(query, (err, result) => {
      done();
      if (err) {
        return res.send({ error: err.detail, success: false });
      }
      else {
        if (result.rows.length > 0) {
          const hashed = saltedMd5(req.body.password, salt);
          if (hashed === result.rows[0].password) {
            return res.send({ error: null, success: true });
          }
          else {
            return res.send({ error: 'Wrong credentials!', success: false });
          };
        }
        else {
          return res.send({ error: 'User not found!', success: false });
        }
      };
    });
  });
};

module.exports = {
  create_user,
  verify_login
};