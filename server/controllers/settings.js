import { pool } from '../helpers/database.js';

export const load_settings = (req, res) => {
    (async () => {
        const client = await pool.connect();
        try {
            if (req.body.id) {
                const userID = req.body.id;
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

export const save_settings = (req, res) => {
    (async () => {
        const client = await pool.connect();
        try {
            if (req.body.id) {
                const userID = req.body.id;
                const query = `UPDATE config SET settings = '${JSON.stringify(req.body.obj)}' WHERE user_id = '${userID}';`;
                await client.query(query);
                return res.send({ error: null, success: true });
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