import { useState, useEffect } from 'react'
import { storage } from '../utils/storage'

export const FocusGraph = () => {
  const [monthData, setMonthData] = useState({})
  const [daysInMonth, setDaysInMonth] = useState(31)

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const days = new Date(year, month, 0).getDate()

    setDaysInMonth(days)
    setMonthData(storage.getMonthFocusData(year, month))
  }, [])

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
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <div
            key={day}
            className="flex flex-col gap-0.5"
            style={{ width: `calc((100% / ${daysInMonth}) - 2px)` }}
          >
            <div className="flex flex-col-reverse gap-0.5">
              {renderDayColumn(day)}
            </div>
            <div className="text-xs text-zinc-500 text-center mt-1">
              {day}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

