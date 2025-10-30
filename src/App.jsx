import { useEffect, useState } from 'react'
import { Timer } from './components/Timer'
import { TodoList } from './components/TodoList'
import { FocusGraph } from './components/FocusGraph'
import { useTimer } from './hooks/useTimer'
import { useTodos } from './hooks/useTodos'

const APP_VERSION = __APP_VERSION__

function App() {
  useEffect(() => {
    document.title = `Daily Time Tracker v${APP_VERSION}`
  }, [])
  const [, forceUpdate] = useState(0)
  const {
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
  } = useTodos()

  const {
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

      if (e.metaKey && e.key === 'u') {
        e.preventDefault()
        handleUpdate()
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
      // 현재 시간을 항상 최신 값으로 가져오는 함수
      const getCurrentTimeSpent = () => {
        const currentTodo = todos.find(t => t.id === todo.id)
        return currentTodo?.timeSpent || 0
      }
      startTimer(todo.id, todo.timeSpent || 0, getCurrentTimeSpent)
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

  const handleUpdate = async () => {
    console.log('🔘 [UI] 업데이트 버튼 클릭됨')

    if (!window.__updateSW) {
      console.error('❌ [UI] updateSW 함수를 찾을 수 없습니다')
      return
    }

    console.log('📡 [UI] 업데이트 함수 호출 시작')
    await window.__updateSW(true)
    console.log('✅ [UI] 업데이트 함수 호출 완료')
  }


  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 p-6 overflow-y-auto flex flex-col">
      <div className="max-w-[800px] mx-auto flex-1 flex flex-col w-full">
        <div className={`transition-all duration-150 ease-in-out overflow-hidden ${
          isTimerVisible
            ? 'flex-1 opacity-100 mb-6'
            : 'flex-[0] min-h-0 max-h-0 opacity-0 mb-0'
        }`}>
          <Timer
            isRunning={timerState === 'running'}
            timerRatios={getTimerRatios()}
            timerDisplay={getTimerDisplay()}
          />
        </div>

        {timerState !== 'running' && <FocusGraph onDateClick={changeDate} selectedDate={selectedDate} />}

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
          onSetTimeSpent={setTodoTimeSpent}
        />

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <a
            href="https://www.producthunt.com/products/pom-shit-done"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors duration-150"
          >
            Product Hunt
          </a>
          <span>|</span>
          <button
            onClick={() => {
              if (window.loadTawkTo) {
                window.loadTawkTo()
              }
            }}
            className="hover:text-zinc-400 transition-colors duration-150"
          >
            Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

