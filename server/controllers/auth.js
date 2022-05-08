import saltedMd5 from 'salted-md5';
import { pool } from '../helpers/index.js';
import { config, salt, client_secret, keycloakurl } from '../settings/index.js';
import fetch from 'node-fetch';
import https from 'https';

const httpsAgent = new https.Agent({
	rejectUnauthorized: false,
});

export const create_user = (req, res) => {
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
				if (err.code === '23505') {
					return res.send({ error: 'User already exists', success: false });
				}
				else {
					return res.send({ error: err.detail, success: false });
				}
			});
	}
	else {
		return res.send({ error: 'Missing information!', success: false });
	}
};
export const verify_login = (req, res) => {
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
				return res.send({ error: err.detail, success: false });
			});
	}
	else {
		return res.send({ error: 'Missing informarion!', success: false });
	}
};
export const gen_kc_token = (req, res) => {
	if (req.body.username && req.body.password && req.body.realm) {
		let urlencoded = new URLSearchParams();
		urlencoded.append("client_id", "MnA_GE");
		urlencoded.append("grant_type", "password");
		urlencoded.append("client_secret", `${client_secret}`);
		urlencoded.append("scope", "openid");
		urlencoded.append("username", `${req.body.username}`);
		urlencoded.append("password", `${req.body.password}`);
		let requestParams = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: urlencoded,
			redirect: 'follow',
			agent: httpsAgent
		};
		fetch(`${keycloakurl}/realms/${req.body.realm}/protocol/openid-connect/token`, requestParams)
			.then(response => {
				if (response.status === 404) {
					return { code: 404, error: 'Invalid realm' }
				}
				else if (response.status === 401 || response.status === 403) {
					return { code: response.status, error: 'Invalid credentials' }
				}
				else if (response.status === 200) {
					return (response.json())
				}
			})
			.then(response => {
				if (!response.code) {
					res.send({ code: 200, token: response.access_token })
				}
				else {
					res.send(response)
				}
			})
			.catch(error => res.send(error));
	}
	else {
		return res.send({ error: 'Bad request', code: 400 });
	}
}