CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    username CHARACTER VARYING(15),
    password TEXT,
    last_login TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    logged_in BOOLEAN,
    UNIQUE(username)
);
CREATE TABLE IF NOT EXISTS users_activities(
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INTEGER,
	login_from TIMESTAMP,
	login_to TIMESTAMP,
	total_activity INTERVAL,
	session_info TEXT,
	CONSTRAINT user_activity FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	UNIQUE(session_info)
);
CREATE TABLE IF NOT EXISTS config(
	id SERIAL PRIMARY KEY NOT NULL,
	settings JSONB,
	user_id INTEGER,
	CONSTRAINT user_settings FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	UNIQUE(user_id)
);