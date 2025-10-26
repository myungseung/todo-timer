import { useEffect, useState } from 'react'
import { Timer } from './components/Timer'
import { TodoList } from './components/TodoList'
import { useTimer } from './hooks/useTimer'
import { useTodos } from './hooks/useTodos'

function App() {
  const [, forceUpdate] = useState(0)
  const {
    todos,
    focusedIndex,
    setFocusedIndex,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodoText,
    updateTodoLevel,
    updateTodoLevels,
    updateTodoTimeSpent,
    getStats
  } = useTodos()

  const {
    timerSeconds,
    timerState,
    currentTodoId,
    startTimer,
    stopTimer,
    getTimerDisplay,
    getTimerRatios
  } = useTimer({
    onTodoTimeUpdate: updateTodoTimeSpent
  })

  useEffect(() => {
    if (timerState === 'running') {
      const interval = setInterval(() => {
        forceUpdate(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timerState])

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.metaKey && e.key === 'Enter') {
        e.preventDefault()
        handleTimerToggle()
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        if (timerState === 'running') {
          const currentId = currentTodoId
          stopTimer()
          setTimeout(() => {
            const currentIndex = todos.findIndex(t => t.id === currentId)
            if (currentIndex !== -1) {
              setFocusedIndex(currentIndex)
            }
          }, 0)
        }
        return
      }

      if (e.target.tagName === 'INPUT') {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
          return
        }
        if (e.shiftKey) {
          return
        }
      }

      if (e.key === 'ArrowUp' && !e.shiftKey) {
        e.preventDefault()
        moveFocus(-1)
      } else if (e.key === 'ArrowDown' && !e.shiftKey) {
        e.preventDefault()
        moveFocus(1)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [timerState, currentTodoId, todos, focusedIndex])

  const handleTimerToggle = () => {
    if (todos.length === 0) return
    const todo = todos[focusedIndex]
    if (!todo || todo.completed) return

    if (timerState === 'stopped') {
      startTimer(todo.id, todo.timeSpent || 0)
    } else if (timerState === 'running' && currentTodoId === todo.id) {
      stopTimer()
    }
  }

  const moveFocus = (direction) => {
    const newIndex = Math.max(0, Math.min(todos.length - 1, focusedIndex + direction))
    setFocusedIndex(newIndex)
  }

  const handleToggleTodo = (id) => {
    toggleTodo(id)
    if (currentTodoId === id && timerState === 'running') {
      stopTimer()
    }
  }

  const isTimerVisible = timerState === 'running'

  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 p-6 overflow-y-auto flex flex-col">
      <div className="max-w-[800px] mx-auto flex-1 flex flex-col w-full">
        <div className={`transition-all duration-150 ease-in-out overflow-hidden ${
          isTimerVisible
            ? 'flex-1 opacity-100 mb-6'
            : 'flex-[0] min-h-0 max-h-0 opacity-0 mb-0'
        }`}>
          <Timer
            timerSeconds={timerSeconds}
            isRunning={timerState === 'running'}
            timerRatios={getTimerRatios()}
            timerDisplay={getTimerDisplay()}
          />
        </div>

        <TodoList
          todos={todos}
          currentTodoId={currentTodoId}
          timerState={timerState}
          focusedIndex={focusedIndex}
          setFocusedIndex={setFocusedIndex}
          getStats={getStats}
          onToggle={handleToggleTodo}
          onUpdateText={updateTodoText}
          onUpdateLevel={updateTodoLevel}
          onUpdateLevels={updateTodoLevels}
          onAddTodo={addTodo}
          onDeleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}

export default App

