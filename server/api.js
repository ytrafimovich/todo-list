const express = require('express')
const { randomBytes } = require('crypto')
const { createUser, getUserByUsername, addTaskToTheList, deleteTaskFromTheList, fulfillTheTask, getAllTasks } = require('./db')
const { hashPassword, checkPassword } = require('./secret')
const { createToken, auth } = require('./token')
const router = express.Router()

router.post('/user', async (req, res) => {
  const salt = randomBytes(16).toString("hex");
  const { username, password, token } = req.body
  if (token !== process.env.TOKEN) {
    return res.json({
      note: 'Token is wrong'
    })
  }
  try {
    user = await getUserByUsername(username)
  } catch (e) {
    if (e.message === `user ${username} does not exist`) {
      await createUser(username, hashPassword(password, salt), salt)
      return res.json({
        note: `User ${username} was created`
      })
    }
  }
  return res.json({
    note: `${username} already exist`
  })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  let user
  try {
    user = await getUserByUsername(username)
  } catch (e) {
    return res.json({
      note: 'Credentials are wrong'
    })
  }

  const { password: pass, salt } = user
  if (checkPassword(password, pass, salt)) {
    return res.json({
      note: 'Login successfully',
      token: createToken(username, salt)
    })
  }
  res.json({
    note: 'Credentials are wrong'
  })
})

router.get('/tasks', async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  const tokenArray = authorization.split(' ')
  const token = tokenArray[1]
  const data = await auth(token)
  if (!data.id) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  const tasks = await getAllTasks()
  return res.json({
    tasks,
    success: true
  })
})

router.post('/tasks', async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  const tokenArray = authorization.split(' ')
  const token = tokenArray[1]
  const { title } = req.body
  if (!title) {
    return res.json({
      note: 'Check input params',
      success: false
    })
  }
  const data = await auth(token)
  if (!data.id) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  let task
  try {
    task = await addTaskToTheList(title, data.id)
  } catch (e) {
    return res.json({
      note: 'Something went wrong',
      success: false
    })
  }
  return res.json({
    note: 'Task was successfully added',
    task: {
      id: task.id,
      title: task.title,
      COMPLETED_AT: null,
      CREATED_AT: task.CREATED_AT,
      username: data.username
    },
    success: true
  })
})

router.delete('/tasks', async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  const tokenArray = authorization.split(' ')
  const token = tokenArray[1]
  const { id } = req.body
  if (!id) {
    return res.json({
      note: 'Check input params',
      success: false
    })
  }
  const data = await auth(token)
  if (!data.id) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  try {
    await deleteTaskFromTheList(id)
  } catch (e) {
    return res.json({
      note: 'Something went wrong',
      success: false
    })
  }
  return res.json({
    note: 'Task was successfully deleted',
    success: true
  })
})

router.post('/tasks/finished', async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  const tokenArray = authorization.split(' ')
  const token = tokenArray[1]
  const { id } = req.body
  if (!id) {
    return res.json({
      note: 'Check input params',
      success: false
    })
  }
  const data = await auth(token)
  if (!data.id) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  let task
  try {
    task = await fulfillTheTask(id)
  } catch (e) {
    return res.json({
      note: 'Something went wrong',
      success: false
    })
  }
  return res.json({
    note: 'Task was successfully fulfilled',
    task,
    success: true
  })
})

router.post('/authorise', async (req, res) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.json({
      note: 'Token is invalid',
      success: false
    })
  }
  const tokenArray = authorization.split(' ')
  const token = tokenArray[1]
  const data = await auth(token)
  res.json({
    success: data.success,
    note: data.note
  })
})

module.exports = router