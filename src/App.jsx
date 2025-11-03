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
    console.log('🚀 [App] 마운트됨', { version: APP_VERSION, timestamp: new Date().toISOString() })

    // 메모리 사용량 추적 (5분마다)
    const memoryInterval = setInterval(() => {
      if (performance.memory) {
        console.log('💾 [Memory]', {
          usedJSHeapSize: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          totalJSHeapSize: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          jsHeapSizeLimit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
          timestamp: new Date().toISOString()
        })
      }
    }, 5 * 60 * 1000) // 5분마다

    // Visibility change 추적
    const handleVisibilityChange = () => {
      console.log('👁️ [App] Visibility 변경:', {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
        timestamp: new Date().toISOString()
      })
    }

    // 페이지 언로드 이벤트
    const handleBeforeUnload = () => {
      console.log('⚠️ [App] beforeunload 이벤트', { timestamp: new Date().toISOString() })
    }

    const handlePageHide = (e) => {
      console.log('👋 [App] pagehide 이벤트', {
        persisted: e.persisted,
        timestamp: new Date().toISOString()
      })
    }

    const handleUnload = () => {
      console.log('💀 [App] unload 이벤트', { timestamp: new Date().toISOString() })
    }

    // 포커스 이벤트
    const handleFocus = () => {
      console.log('🎯 [App] 포커스 획득', { timestamp: new Date().toISOString() })
    }

    const handleBlur = () => {
      console.log('😴 [App] 포커스 상실', { timestamp: new Date().toISOString() })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('unload', handleUnload)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      console.log('🔥 [App] 언마운트됨', { timestamp: new Date().toISOString() })
      clearInterval(memoryInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('unload', handleUnload)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
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
      console.log('🔄 [App] forceUpdate interval 시작', { timestamp: new Date().toISOString() })
      let tickCount = 0
      const interval = setInterval(() => {
        tickCount++
        forceUpdate(prev => prev + 1)
        if (tickCount % 60 === 0) {
          console.log(`🔄 [App] forceUpdate 60회 실행됨 (${tickCount}회)`, { timestamp: new Date().toISOString() })
        }
      }, 1000)
      return () => {
        console.log('🔥 [App] forceUpdate interval 정리됨', { tickCount, timestamp: new Date().toISOString() })
        clearInterval(interval)
      }
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

