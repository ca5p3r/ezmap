const { pool } = require('../helpers/database');

const load_settings = (req, res) => {
    const getIDQuery = `SELECT id FROM users WHERE username='${req.body.username}';`;
    (async () => {
        const client = await pool.connect();
        try {
            const userResult = await client.query(getIDQuery);
            if (userResult.rows.length > 0) {
                const userID = userResult.rows[0].id;
                const query = `SELECT settings FROM config WHERE user_id = '${userID}';`;
                const settingsResult = await client.query(query);
                if (settingsResult.rows.length > 0) {
                    return res.send({ error: null, success: true, config: settingsResult.rows[0].settings });
                }
                else {
                    return res.send({ error: 'Settings not found!', success: false });
                }
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
};

module.exports = {
    load_settings
};