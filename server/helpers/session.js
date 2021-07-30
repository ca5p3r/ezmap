// def gen_session_id():                       # Create random session id that doesn't exist previously in DB
// global session_id
// try:
// session_id = gen_id()
// query = users_queries['get-all-sessions']
// sessions_list = []
// connection = pg_connector().db_connect()
// cursor = connection.cursor()
// cursor.execute(query)
// results = cursor.fetchall()
// for result in results:
//     sessions_list.append(result[0])
// while True:
//     if session_id in sessions_list:
//         session_id = gen_id()
//     else:
//     break
// return session_id
// except Exception as error:
// return error
//     finally:
// if connection:
//     connection.close()
// cursor.close()