export const storage = {
  getTodos() {
    const stored = localStorage.getItem('todos')
    return stored ? JSON.parse(stored) : []
  },

  saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos))
  },

  getTotalTimeSpent() {
    const time = localStorage.getItem('totalTimeSpent')
    return time ? parseInt(time) : 0
  },

  saveTotalTimeSpent(time) {
    localStorage.setItem('totalTimeSpent', time.toString())
  }
}

