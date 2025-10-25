import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'

export const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)

  useEffect(() => {
    const loadedTodos = storage.getTodos()
    const loadedTime = storage.getTotalTimeSpent()
    setTodos(loadedTodos)
    setTotalTimeSpent(loadedTime)

    if (loadedTodos.length === 0) {
      const todo = {
        id: Date.now(),
        text: '',
        completed: false,
        level: 0,
        pomCount: 0
      }
      setTodos([todo])
    }
  }, [])

  useEffect(() => {
    if (todos.length > 0) {
      storage.saveTodos(todos)
    }
  }, [todos])

  useEffect(() => {
    storage.saveTotalTimeSpent(totalTimeSpent)
  }, [totalTimeSpent])

  const addTodo = (afterId, level) => {
    const todo = {
      id: Date.now(),
      text: '',
      completed: false,
      level: level,
      pomCount: 0
    }

    setTodos(prev => {
      if (afterId === null) {
        return [...prev, todo]
      }
      const index = prev.findIndex(t => t.id === afterId)
      const newTodos = [...prev]
      newTodos.splice(index + 1, 0, todo)
      return newTodos
    })

    return todo.id
  }

  const deleteTodo = (id) => {
    setTodos(prev => {
      const index = prev.findIndex(t => t.id === id)
      if (index === -1) return prev

      const level = prev[index].level
      let deleteCount = 1

      for (let i = index + 1; i < prev.length; i++) {
        if (prev[i].level <= level) break
        deleteCount++
      }

      const newTodos = [...prev]
      newTodos.splice(index, deleteCount)

      let nextFocusIndex = index
      if (index >= newTodos.length) {
        nextFocusIndex = newTodos.length - 1
      }
      setFocusedIndex(Math.max(0, nextFocusIndex))

      if (newTodos.length === 0) {
        setTimeout(() => addTodo(null, 0), 0)
      }

      return newTodos
    })
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const updateTodoText = (id, text) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, text } : t
    ))
  }

  const updateTodoLevel = (id, level) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, level } : t
    ))
  }

  const updateTodoPomCount = (id, pomCount) => {
    console.log('updateTodoPomCount called:', { id, pomCount })
    setTodos(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, pomCount } : t
      )
      console.log('todos after update:', updated)
      return updated
    })
  }

  const getStats = () => {
    const completed = todos.filter(t => t.completed).length
    const total = todos.length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0

    const hours = Math.floor(totalTimeSpent / 3600)
    const mins = Math.floor((totalTimeSpent % 3600) / 60)

    const totalPom = todos.reduce((sum, t) => sum + (t.pomCount || 0), 0)

    return { rate, hours, mins, totalPom }
  }

  return {
    todos,
    focusedIndex,
    setFocusedIndex,
    totalTimeSpent,
    setTotalTimeSpent,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodoText,
    updateTodoLevel,
    updateTodoPomCount,
    getStats
  }
}

