import React, { useState, useEffect } from 'react'
import axios from 'axios'

const TodoList = () => {
  const [todoItem, onItemChange] = useState('')
  const [list, onUpdateList] = useState([])
  const updateList = (newList) => {
    onUpdateList(newList.sort((a, b) => (b.COMPLETED_AT === null) - (a.COMPLETED_AT === null)))
  }
  const token = localStorage.getItem('token')
  const headers = {
    authorization: `Bearer ${token}`
  }
  const options = {
    headers
  }

  const addItemToTheList = async () => {
    const { data } = await axios.post('/api/v1/tasks', { title: todoItem }, options)
    if (data.task) {
      const newList = [...list]
      newList.push(data.task)
      updateList(newList)
      onItemChange('')
    }
  }

  const onDeleteItemFromList = async (id) => {
    const { data } = await axios.delete('/api/v1/tasks', { data: { id }, headers })
    if (data.success) {
      const newList = list.filter(({ id: itemId }) => id !== itemId)
      updateList(newList)
    }
  }

  const onFulfillItemFromList = async (id) => {
    const { data } = await axios.post('/api/v1/tasks/finished', { id }, options)
    if (data.success && data.task) {
      const newList = list.map((item) => {
        if (item.id !== id) {
          return item
        }
        return data.task
      })
      updateList(newList)
    }
  }

  useEffect(async () => {
    const { data } = await axios.get('/api/v1/tasks', options)
    updateList(data.tasks)
  }, [])

  const itemList = list.map((item) => 
    <li class="todo-element">
      <span className={`todo-item-title ${!!item.COMPLETED_AT && 'todo-item-fulfilled'}`}>{item.title}</span>
      <span class="delete-icon" onClick={() => onDeleteItemFromList(item.id)}><i class="fas fa-trash"></i></span>
      {
        !item.COMPLETED_AT && <span class="fulfill-icon" onClick={() => onFulfillItemFromList(item.id)}><i class="fas fa-solid fa-check"></i></span>
      }
    </li>
  )

  return (
    <>
      <header>TODO List</header>
      <div class="todo-input">
        <input value={todoItem} onChange={e => onItemChange(e.target.value)} class="todo-input-field" type="text" placeholder="Add your new todo" />
        <button class="todo-input-button" onClick={addItemToTheList}><i class="fas fa-plus"></i></button>
      </div>
      {
        list.length > 0 &&
          (
            <ul class="todo-list">
              {itemList}
            </ul>
          )
        }
    </>
  )
}

export default TodoList
