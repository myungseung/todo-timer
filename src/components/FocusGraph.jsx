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
    const pomCount = totalSeconds / 3000
    const fullCells = Math.floor(pomCount)
    const partialValue = pomCount % 1

    const cells = []
    for (let i = 0; i < fullCells; i++) {
      cells.push(
        <div
          key={`full-${i}`}
          className="bg-red-500 aspect-square"
          style={{ opacity: 1 }}
        />
      )
    }

    if (partialValue > 0) {
      cells.push(
        <div
          key="partial"
          className="bg-red-500 aspect-square"
          style={{ opacity: partialValue }}
        />
      )
    }

    return cells
  }

  return (
    <div className="w-full mb-6">
      <div className="flex gap-0.5">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <div
            key={day}
            className="flex flex-col-reverse gap-0.5"
            style={{ width: `calc((100% / ${daysInMonth}) - 2px)` }}
          >
            {renderDayColumn(day)}
            <div className="text-xs text-zinc-500 text-center mt-1">
              {day}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

