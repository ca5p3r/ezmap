const saltedMd5 = require('salted-md5');
const { pool } = require('../helpers/database');

const config = require('../settings/config.json');

const salt = 'f387d4f7781b57ac232c227fcef831d0';

const create_user = (req, res) => {
  if (req.body.username && req.body.password) {
    const hashed = saltedMd5(req.body.password, salt);
    const userQuery = `INSERT INTO users (username, password) VALUES ('${req.body.username}', '${hashed}') RETURNING id;`;
    (async () => {
      const client = await pool.connect();
      try {
        const userResult = await client.query(userQuery);
        const userID = userResult.rows[0].id;
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
  }
  else {
    return res.send({ error: 'Missing information!', success: false });
  }
};

const verify_login = (req, res) => {
  if (req.body.username && req.body.password) {
    const query = `SELECT id, password FROM users WHERE username = '${req.body.username}';`;
    (async () => {
      const client = await pool.connect();
      try {
        const result = await client.query(query);
        if (result.rows.length > 0) {
          const password = result.rows[0].password;
          const hashed = saltedMd5(req.body.password, salt);
          if (hashed === password) {
            return res.send({ error: null, success: true, userID: result.rows[0].id });
          }
          else {
            return res.send({ error: 'Wrong credentials!', success: false });
          };
        }
        else {
          return res.send({ error: 'User not found!', success: false });
        }
      } finally {
        client.release()
      }
    })
      ().catch(err => {
        switch (err.code) {
          default:
            return res.send({ error: err.detail, success: false });
        }
      });
  }
  else {
    return res.send({ error: 'Missing informarion!', success: false });
  }

};

module.exports = {
  create_user,
  verify_login
};