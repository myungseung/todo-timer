const getTodayKey = () => new Date().toISOString().split('T')[0]

export const storage = {
  getData() {
    const stored = localStorage.getItem('todoTimerData')
    return stored ? JSON.parse(stored) : {}
  },

  saveData(data) {
    localStorage.setItem('todoTimerData', JSON.stringify(data, null, 2))
  },

  getTodayTodos() {
    const data = this.getData()
    const today = getTodayKey()
    return data[today]?.todos || []
  },

  saveTodayTodos(todos) {
    const data = this.getData()
    const today = getTodayKey()
    if (!data[today]) data[today] = {}
    data[today].todos = todos
    this.saveData(data)
  },

  saveTodosByDate(dateKey, todos) {
    const data = this.getData()
    if (!data[dateKey]) data[dateKey] = {}
    data[dateKey].todos = todos
    this.saveData(data)
  },

  exportToFile() {
    const data = this.getData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-timer-${getTodayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  },

  getMonthFocusData(year, month) {
    const data = this.getData()
    const daysInMonth = new Date(year, month, 0).getDate()
    const result = {}

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayData = data[dateKey]

      if (dayData?.todos) {
        const totalTimeSpent = dayData.todos.reduce((sum, todo) => sum + (todo.timeSpent || 0), 0)
        result[day] = totalTimeSpent
      } else {
        result[day] = 0
      }
    }

    return result
  }
}

