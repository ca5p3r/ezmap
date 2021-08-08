const saltedMd5 = require('salted-md5');
const { pool } = require('../helpers/database');

const config = require('../settings/config.json');

const salt = 'f387d4f7781b57ac232c227fcef831d0';

const create_user = (req, res) => {
  const hashed = saltedMd5(req.body.password, salt);
  const userQuery = `INSERT INTO users (username, password) VALUES ('${req.body.username}', '${hashed}');`;
  const getIDQuery = `SELECT id FROM users WHERE username='${req.body.username}';`;
  (async () => {
    const client = await pool.connect();
    try {
      await client.query(userQuery);
      const result = await client.query(getIDQuery);
      const userID = result.rows[0].id;
      const settingsQuery = `INSERT INTO config (settings, user_id) VALUES ('${JSON.stringify(config)}', ${userID});`;
      await client.query(settingsQuery);
      return res.send({ error: null, success: true });
    } finally {
      client.release()
    }
  })
    ().catch(err => {
      switch (err.code) {
        case '23505':
          return res.send({ error: 'User already exists', success: false });
        default:
          return res.send({ error: err.detail, success: false });
      }
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