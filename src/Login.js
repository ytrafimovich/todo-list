import React, { useState } from 'react'
import axios from 'axios'

const Login = ({ setIsSubmitted }) => {
  const [errorMessages, setErrorMessages] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const database = [
    {
      username: "user1",
      password: "pass1",
      token: 'abcd1',
    },
    {
      username: "user2",
      password: "pass2",
      token: 'masha1',
    }
  ]

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  }

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault()
    setIsLoading(true)
    // Find user login info
    // const userData = database.find((user) => user.username === username)
    const login = await axios.post('/api/v1/login', { username, password })
    // Compare user info
    if (login?.data?.token) {
      localStorage.setItem('token', login.data.token)
      setIsSubmitted(true)
    } else {
      // Username not found
      setErrorMessages({ name: "pass", message: errors.uname })
    }
    setIsLoading(false)
  }

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    )

    const renderForm = (
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input value={username} class="login-input" onChange={e => setUsername(e.target.value)} type="text" name="uname" placeholder="Username" required />
          </div>
          <div className="input-container">
            <input value={password} class="login-input" onChange={e => setPassword(e.target.value)} type="password" name="pass" placeholder="Password" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="button-container">
            <input class="submit-button" type="submit" disabled={isLoading} />
          </div>
        </form>
      </div>
    )

    return (
      <div className="login">
        <div className="login-form">
            {renderForm}
        </div>
      </div>
    )
}

export default Login
