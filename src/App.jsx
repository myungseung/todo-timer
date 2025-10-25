import { useEffect } from 'react'
import { Timer } from './components/Timer'
import { TodoList } from './components/TodoList'
import { useTimer } from './hooks/useTimer'
import { useTodos } from './hooks/useTodos'

function App() {
  const {
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
  } = useTodos()

  const {
    timerSeconds,
    timerState,
    currentTodoId,
    currentTimerStartTime,
    showPopup,
    startTimer,
    stopTimer,
    continueTimer,
    setShowPopup,
    getTimerDisplay,
    getTimerRatios
  } = useTimer({
    onTimeSpent: (elapsed) => {
      setTotalTimeSpent(prev => prev + elapsed)
    },
    onTodoPomUpdate: (todoId, pomCount) => {
      console.log('onTodoPomUpdate called:', { todoId, pomCount, todos })
      const todo = todos.find(t => t.id === todoId)
      console.log('found todo:', todo)
      if (todo) {
        const newPomCount = (todo.pomCount || 0) + pomCount
        console.log('updating pomCount to:', newPomCount)
        updateTodoPomCount(todoId, newPomCount)
      }
    }
  })

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
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveFocus(-1)
      } else if (e.key === 'ArrowDown') {
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
      startTimer(todo.id)
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
            currentTimerStartTime={currentTimerStartTime}
            getTimerDisplay={getTimerDisplay}
            getTimerRatios={getTimerRatios}
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
          onAddTodo={addTodo}
          onDeleteTodo={deleteTodo}
        />
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center max-w-[400px] shadow-2xl">
            <div className="text-5xl mb-4">⏰</div>
            <div className="text-[15px] text-zinc-400 mb-6 leading-relaxed">
              시간이 초과되었습니다!<br />25분을 추가로 제공합니다.
            </div>
            <button
              className="bg-red-500 text-zinc-50 border-none rounded-md px-6 py-2.5 text-sm cursor-pointer font-semibold transition-colors hover:bg-red-600"
              onClick={continueTimer}
            >
              계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

