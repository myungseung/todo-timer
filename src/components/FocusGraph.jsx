import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'

export const FocusGraph = ({ onDateClick, selectedDate }) => {
  const [monthData, setMonthData] = useState({})
  const [daysInMonth, setDaysInMonth] = useState(31)
  const [currentYear, setCurrentYear] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(null)

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const days = new Date(year, month, 0).getDate()

    setCurrentYear(year)
    setCurrentMonth(month)
    setDaysInMonth(days)
    setMonthData(storage.getMonthFocusData(year, month))
  }, [])

  const isSelectedDate = (day) => {
    if (!selectedDate || !currentYear || !currentMonth) return false
    const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return selectedDate.toISOString().split('T')[0] === dateKey
  }

  const handleDateClick = (day) => {
    if (onDateClick) {
      const date = new Date(currentYear, currentMonth - 1, day)
      onDateClick(date)
    }
  }

  const renderDayColumn = (day) => {
    const totalSeconds = monthData[day] || 0
    const MAX_CELLS = 6
    const SECONDS_PER_CELL = 2400 // 40분 = 2400초 (4시간 / 6개 = 40분)

    const cellCount = totalSeconds / SECONDS_PER_CELL
    const fullCells = Math.floor(cellCount)
    const partialValue = cellCount % 1

    const cells = []

    for (let i = 0; i < MAX_CELLS; i++) {
      if (i < fullCells) {
        cells.push(
          <div
            key={i}
            className="bg-red-500 aspect-square"
            style={{ opacity: 1 }}
          />
        )
      } else if (i === fullCells && partialValue > 0) {
        cells.push(
          <div
            key={i}
            className="bg-red-500 aspect-square"
            style={{ opacity: partialValue }}
          />
        )
      } else {
        cells.push(
          <div
            key={i}
            className="bg-zinc-800 aspect-square"
          />
        )
      }
    }

    return cells
  }

  return (
    <div className="w-full mb-6 px-6">
      <div className="flex gap-0.5">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const selected = isSelectedDate(day)
          return (
            <div
              key={day}
              className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: `calc((100% / ${daysInMonth}) - 2px)` }}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex flex-col-reverse gap-0.5 border-2 border-transparent"
                style={{
                  borderColor: selected ? '#ef4444' : 'transparent',
                  borderRadius: '4px'
                }}
              >
                {renderDayColumn(day)}
              </div>
              <div className={`text-xs text-center mt-1 ${selected ? 'text-red-500 font-semibold' : 'text-zinc-500'}`}>
                {day}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

