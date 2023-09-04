const mysql = require('mysql');
const util = require('util')
 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const query = util.promisify(connection.query).bind(connection)
 
connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to MySQL database!');
});

const getUsers = async () => {
  const rows = await query('select * from users')
  return rows
}

const getUserByUsername = async (username) => {
  const rows = await query('select * from users where username=?', [username])
  if (!rows || rows.length === 0) {
    throw new Error(`user ${username} does not exist`)
  }
  return rows[0]
}

const createUser = async (username, password, salt) => {
  await query('insert into users(username, password, salt) values(?,?,?)', [username, password, salt])
}

const addTaskToTheList = async (title, user_id) => {
  await query('insert into tasks(user_id, title) values(?,?)', [user_id, title])
  const task = await query('select * from tasks where title=? AND user_id=? AND is_deleted=0', [title, user_id])
  return task[0]
}

const fulfillTheTask = async (id) => {
  await query('update tasks set COMPLETED_AT=? where id = ?', [new Date(), id])
  const task = await query('select * from tasks where id=? ', [id])
  return task[0]
}

const deleteTaskFromTheList = (id) => {
  return query('update tasks set is_deleted=1 where id = ?', [id])
}

const getAllTasks = () => {
  return query('select t.id, t.title, t.CREATED_AT, t.COMPLETED_AT, u.username from tasks as t left join users as u on t.user_id = u.id where t.is_deleted=0')
}

module.exports = {
  addTaskToTheList,
  connection,
  deleteTaskFromTheList,
  fulfillTheTask,
  getAllTasks,
  getUserByUsername,
  getUsers,
  createUser
}