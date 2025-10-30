import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'

const getDateKey = (date) => date.toISOString().split('T')[0]

export const useTodos = () => {
  const [todos, setTodos] = useState([])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date())

  // 날짜 변경 시 해당 날짜의 데이터 로드
  useEffect(() => {
    const dateKey = getDateKey(selectedDate)
    const data = storage.getData()
    const loadedTodos = data[dateKey]?.todos || []

    if (loadedTodos.length === 0 && dateKey === getDateKey(new Date())) {
      // 오늘 날짜만 빈 todo 생성
      const todo = {
        id: Date.now(),
        text: '',
        completed: false,
        level: 0,
        timeSpent: 0
      }
      setTodos([todo])
    } else {
      setTodos(loadedTodos)
    }
  }, [selectedDate])

  useEffect(() => {
    if (todos.length > 0) {
      const dateKey = getDateKey(selectedDate)
      storage.saveTodosByDate(dateKey, todos)
    }
  }, [todos, selectedDate])

  const addTodo = (afterId, level, insertBefore = false) => {
    const todo = {
      id: Date.now(),
      text: '',
      completed: false,
      level: level,
      timeSpent: 0
    }

    setTodos(prev => {
      if (afterId === null) {
        return [...prev, todo]
      }
      const index = prev.findIndex(t => t.id === afterId)
      const newTodos = [...prev]
      newTodos.splice(insertBefore ? index : index + 1, 0, todo)
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

  const updateTodoLevels = (ids, delta) => {
    setTodos(prev => prev.map(t => {
      if (ids.includes(t.id)) {
        const newLevel = Math.max(0, Math.min(3, t.level + delta))
        return { ...t, level: newLevel }
      }
      return t
    }))
  }

  const updateTodoTimeSpent = (id, additionalSeconds) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, timeSpent: (t.timeSpent || 0) + additionalSeconds } : t
    ))
  }

  const setTodoTimeSpent = (id, seconds) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, timeSpent: Math.max(0, Math.floor(seconds)) } : t
    ))
  }

  const getStats = () => {
    const totalTimeSpent = todos.reduce((sum, t) => sum + (t.timeSpent || 0), 0)
    const hours = Math.floor(totalTimeSpent / 3600)
    const mins = Math.floor((totalTimeSpent % 3600) / 60)

    // 50분 = 1 pom
    const totalPom = Math.round(totalTimeSpent / (50 * 60) * 10) / 10

    return { hours, mins, totalPom }
  }

  const changeDate = (date) => {
    setSelectedDate(date)
  }

  return {
    todos,
    focusedIndex,
    setFocusedIndex,
    selectedDate,
    changeDate,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodoText,
    updateTodoLevel,
    updateTodoLevels,
    updateTodoTimeSpent,
    setTodoTimeSpent,
    getStats
  }
}

