CREATE TABLE IF NOT EXISTS users (
    id serial primary key not null,
    username character varying (15),
    password text,
    last_login timestamp,
    active boolean default true,
    logged_in boolean,
    unique(username)
);
CREATE TABLE IF NOT EXISTS users_activities(
	id serial not null primary key,
	user_id integer,
	login_from timestamp,
	login_to timestamp,
	total_activity interval,
	session_info text,
	constraint user_activity foreign key (user_id) references users(id) on update cascade on delete cascade,
	unique(session_info)
);