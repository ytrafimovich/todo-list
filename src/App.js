import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './Login'
import Loading from './Loading'
import TodoList from './TodoList'
import './styles.css'

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  const [isAuthorised, setIsAuthorised] = useState(false)

  useEffect(async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.post('/api/v1/authorise', {}, { headers: { authorization: `Bearer ${token}` } })
      const { data } = res
      let isAuthorised = false
      if (data) {
        isAuthorised = data.success
      }
      setIsAuthorised(isAuthorised)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div>
      {
        isAuthorised ? 
          <TodoList /> :
          <Login setIsSubmitted={setIsAuthorised} />
      }
    </div>
  )
}

export default App

