import { useRef, useEffect, useState } from 'react'

export const TodoList = ({
  todos,
  currentTodoId,
  timerState,
  focusedIndex,
  setFocusedIndex,
  getStats,
  onToggle,
  onUpdateText,
  onUpdateLevel,
  onUpdateLevels,
  onAddTodo,
  onDeleteTodo,
  onSetTimeSpent
}) => {
  const inputRefs = useRef({})
  const isComposingRef = useRef(false)
  const [selectedTodos, setSelectedTodos] = useState(new Set())
  const [editingTimeId, setEditingTimeId] = useState(null)
  const [editTimeValue, setEditTimeValue] = useState('')
  const timeInputRefs = useRef({})
  const stats = getStats()

  useEffect(() => {
    if (todos.length > 0 && todos[focusedIndex]) {
      const input = inputRefs.current[todos[focusedIndex].id]
      if (input) {
        input.focus()
      }
    }
  }, [focusedIndex, todos])

  const handleKeyDown = (e, todo, index) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setSelectedTodos(new Set())
      return
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !isComposingRef.current) {
      e.preventDefault()
      const cursorPos = e.target.selectionStart
      if (cursorPos === 0 && e.target.value !== '') {
        onAddTodo(todo.id, todo.level, true)
        setFocusedIndex(index)
      } else {
        onAddTodo(todo.id, todo.level, false)
        setFocusedIndex(index + 1)
      }
      setSelectedTodos(new Set())
    }

    if (e.key === 'ArrowUp' && e.shiftKey) {
      e.preventDefault()
      if (index > 0) {
        const newIndex = index - 1
        setFocusedIndex(newIndex)
        setSelectedTodos(prev => {
          const newSet = new Set(prev)
          newSet.add(todo.id)
          newSet.add(todos[newIndex].id)
          return newSet
        })
      }
      return
    }

    if (e.key === 'ArrowDown' && e.shiftKey) {
      e.preventDefault()
      if (index < todos.length - 1) {
        const newIndex = index + 1
        setFocusedIndex(newIndex)
        setSelectedTodos(prev => {
          const newSet = new Set(prev)
          newSet.add(todo.id)
          newSet.add(todos[newIndex].id)
          return newSet
        })
      }
      return
    }

    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.shiftKey) {
      setSelectedTodos(new Set())
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (selectedTodos.size > 0) {
        const selectedIds = Array.from(selectedTodos)
        onUpdateLevels(selectedIds, e.shiftKey ? -1 : 1)
      } else {
        if (e.shiftKey) {
          if (todo.level > 0) {
            onUpdateLevel(todo.id, todo.level - 1)
          }
        } else {
          if (todo.level < 3) {
            onUpdateLevel(todo.id, todo.level + 1)
          }
        }
      }
    }

    if (e.key === 'Backspace' && e.target.value === '') {
      e.preventDefault()
      onDeleteTodo(todo.id)
      setSelectedTodos(new Set())
    }
  }

  const isCompact = timerState === 'running'

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg flex flex-col overflow-hidden transition-all duration-150 ${
      isCompact ? 'flex-[0_0_auto] overflow-visible' : 'flex-1'
    }`}>
      <div className={`flex gap-5 items-center text-xs text-zinc-500 py-3 border-b border-zinc-800 mb-3 flex-shrink-0 transition-all duration-150 ${
        isCompact ? 'hidden' : 'flex'
      }`}>
        <div className="flex gap-1.5 items-center">
          <span>Total Time</span>
          <span className="font-semibold text-zinc-400 tabular-nums">{stats.hours}h {stats.mins}m</span>
        </div>
        <div className="flex gap-1.5 items-center ml-auto">
          <span className="font-semibold text-zinc-400 tabular-nums">🍅 {stats.totalPom.toFixed(1)}</span>
        </div>
      </div>

      <ul className={`list-none min-h-0 transition-all duration-150 ${
        isCompact ? 'flex-[0_0_auto] overflow-visible' : 'flex-1 overflow-y-auto'
      }`}>
        {todos.map((todo, index) => {
          const isActive = currentTodoId === todo.id && timerState === 'running'
          const isHidden = timerState === 'running' && currentTodoId !== todo.id
          const paddingLeft = {
            0: 'pl-3',
            1: 'pl-11',
            2: 'pl-[76px]',
            3: 'pl-[108px]'
          }[todo.level]

          return (
            <li
              key={todo.id}
              style={isHidden ? {
                height: 0,
                minHeight: 0,
                maxHeight: 0,
                padding: 0,
                margin: 0,
                border: 0,
                opacity: 0
              } : {}}
              className={`flex items-center gap-3 p-2.5 px-3 rounded-md transition-all duration-150 relative border border-transparent min-h-[44px] ${paddingLeft} ${
                isActive ? 'bg-red-500/10 border-l-[3px] border-l-red-500' : ''
              } ${
                isHidden ? 'overflow-hidden pointer-events-none' : ''
              } ${
                !isActive && !isHidden ? 'hover:bg-zinc-800' : ''
              } ${
                todo.completed ? 'opacity-60' : ''
              } ${
                selectedTodos.has(todo.id) ? 'bg-blue-500/10' : ''
              }`}
            >
              <input
                type="checkbox"
                className="w-[18px] h-[18px] cursor-pointer flex-shrink-0 appearance-none border-2 border-zinc-600 rounded bg-transparent relative checked:bg-red-500 checked:border-red-500 after:content-[''] after:absolute after:left-[5px] after:top-[2px] after:w-[4px] after:h-[8px] after:border-zinc-50 after:border-r-2 after:border-b-2 after:rotate-45 after:opacity-0 checked:after:opacity-100"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
              />
              <input
                ref={el => inputRefs.current[todo.id] = el}
                type="text"
                className={`flex-1 bg-transparent border-none text-zinc-50 text-[15px] outline-none font-inherit p-0.5 cursor-text ${
                  todo.completed ? 'line-through text-zinc-500' : ''
                }`}
                placeholder="New task..."
                value={todo.text}
                onChange={(e) => onUpdateText(todo.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, todo, index)}
                onCompositionStart={() => isComposingRef.current = true}
                onCompositionEnd={() => isComposingRef.current = false}
                onClick={() => {
                  setFocusedIndex(index)
                  setSelectedTodos(new Set())
                }}
                onFocus={() => setFocusedIndex(index)}
              />
              {todo.timeSpent > 0 && (
                <>
                  {editingTimeId === todo.id ? (
                    <div className="flex items-center gap-1.5 bg-zinc-950 border border-red-500 rounded-md px-2 py-0.5 text-[13px] text-zinc-400 whitespace-nowrap tabular-nums flex-shrink-0">
                      <input
                        ref={el => timeInputRefs.current[todo.id] = el}
                        type="text"
                        value={editTimeValue}
                        onChange={(e) => setEditTimeValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const seconds = parseInt(editTimeValue) || 0
                            onSetTimeSpent(todo.id, seconds)
                            setEditingTimeId(null)
                            setEditTimeValue('')
                          }
                          if (e.key === 'Escape') {
                            setEditingTimeId(null)
                            setEditTimeValue('')
                          }
                        }}
                        onBlur={() => {
                          const seconds = parseInt(editTimeValue) || 0
                          onSetTimeSpent(todo.id, seconds)
                          setEditingTimeId(null)
                          setEditTimeValue('')
                        }}
                        className="bg-transparent border-none outline-none text-zinc-50 w-16"
                        placeholder="sec"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingTimeId(todo.id)
                        setEditTimeValue(todo.timeSpent.toString())
                      }}
                      className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-0.5 text-[13px] text-zinc-400 whitespace-nowrap tabular-nums flex-shrink-0 cursor-pointer hover:border-zinc-700"
                    >
                      <span>{Math.floor(todo.timeSpent / 60)}:{(todo.timeSpent % 60).toString().padStart(2, '0')}</span>
                      <span className="text-zinc-500">🍅{(Math.round((todo.timeSpent / (50 * 60)) * 10) / 10).toFixed(1)}</span>
                    </div>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

