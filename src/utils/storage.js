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

  exportToFile() {
    const data = this.getData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-timer-${getTodayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

