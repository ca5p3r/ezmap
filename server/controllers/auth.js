const saltedMd5 = require('salted-md5');
const { pgConnector } = require('../helpers/database');


const create_user = (req, res) => {
  const pool = pgConnector.getConnection('ezmap');
  const salt = 'f387d4f7781b57ac232c227fcef831d0';
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

// def verify_login():                         # Verify login process
// global active_user
// global active_user_id
// global login_tries_counter
// gen_session_id()
// username = user_control_win.loginUsernameEdit.text()
// password = user_control_win.loginPasswordEdit.text()
// if username != '' and password != '':
// if len(username) < 16 and len(username) > 3:
// if login_tries_counter != 4:
//   try:
// query = users_queries['get-user-password'].format(username)
// connection = pg_connector().db_connect()
// cursor = connection.cursor()
// cursor.execute(query)
// results = cursor.fetchall()
// if results != []:
//   user_id = results[0][0]
// hashed = results[0][1]
// if bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8')):
//   user_control_win.loginAnnouncer.setText(
//     success_messages['users']['login'][active_language])
// active_user = username
// update_query = users_queries['update-active-user'].format(
//   datetime.datetime.now(), True, username)
// insert_activity = users_queries['add-user-activity'].format(
//   user_id, datetime.datetime.now(), session_id)
// cursor.execute(update_query)
// cursor.execute(insert_activity)
// build_main_window()
// main_win.show()
// user_control_win.hide()
//                         else:
// user_control_win.loginAnnouncer.setText(
//   error_messages['users']['login']['bad-creds'][active_language])
// login_tries_counter += 1
//                     else:
// user_control_win.loginAnnouncer.setText(
//   error_messages['users']['login']['user-not-found'][active_language])
// login_tries_counter += 1
// except Exception as error:
// print(error)
// user_control_win.loginAnnouncer.setText(
//   error_messages['other']['uncaught-exception'][active_language])
//                 finally:
// if connection:
//   connection.close()
// cursor.close()
// user_control_win.loginUsernameEdit.setText('')
// user_control_win.loginPasswordEdit.setText('')
// user_control_win.signupAnnouncer.setText('')
//             else:
// user_control_win.loginAnnouncer.setText(
//   error_messages['users']['login']['many-tries'][active_language])
// user_control_win.loginButton.setEnabled(False)
//         else:
// user_control_win.loginAnnouncer.setText(
//   error_messages['users']['create']['username-length'][active_language])
//     else:
// user_control_win.loginAnnouncer.setText(
//   error_messages['users']['general']['empty-fields'][active_language])


// def logout():                               # Verify logout
// global active_user
// username = active_user
// try:
// query = users_queries['update-active-user'].format(
//   datetime.datetime.now(), False, username)
// logout_query = users_queries['update-user-activity'].format(
//   datetime.datetime.now(), session_id)
// connection = pg_connector().db_connect()
// cursor = connection.cursor()
// cursor.execute(query)
// cursor.execute(logout_query)
// active_user = None
// cancel_supplier()
// cancel_item()
// user_control_win.show()
// main_win.hide()
// except Exception as error:
// print(error)
// user_control_win.loginAnnouncer.setText(
//   error_messages['other']['uncaught-exception'][active_language])
// finally:
// if connection:
//   connection.close()
// cursor.close()
// user_control_win.loginUsernameEdit.setText('')
// user_control_win.loginPasswordEdit.setText('')
// user_control_win.loginAnnouncer.setText('')
// user_control_win.signupUsernameEdit.setText('')
// user_control_win.signupPasswordEdit.setText('')
// user_control_win.signupAnnouncer.setText('')

module.exports = {
  create_user,
  verify_login
};