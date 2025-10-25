import { useState, useEffect, useRef } from 'react'

const POMODORO_TIME = 50 * 60
const EXTRA_TIME = 25 * 60

export const useTimer = ({ onTimeSpent, onTodoPomUpdate }) => {
  const [timerSeconds, setTimerSeconds] = useState(POMODORO_TIME)
  const [timerState, setTimerState] = useState('stopped')
  const [currentTodoId, setCurrentTodoId] = useState(null)
  const [currentTimerStartTime, setCurrentTimerStartTime] = useState(POMODORO_TIME)
  const [showPopup, setShowPopup] = useState(false)
  const timerIntervalRef = useRef(null)
  const onTimeSpentRef = useRef(onTimeSpent)
  const onTodoPomUpdateRef = useRef(onTodoPomUpdate)

  useEffect(() => {
    onTimeSpentRef.current = onTimeSpent
    onTodoPomUpdateRef.current = onTodoPomUpdate
  }, [onTimeSpent, onTodoPomUpdate])

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const startTimer = (todoId) => {
    setCurrentTodoId(todoId)
    setTimerSeconds(POMODORO_TIME)
    setCurrentTimerStartTime(POMODORO_TIME)
    setTimerState('running')

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
          setTimerState('stopped')
          setShowPopup(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    if (timerState === 'running') {
      const elapsed = currentTimerStartTime - timerSeconds
      onTimeSpentRef.current(elapsed)
      onTodoPomUpdateRef.current(currentTodoId, elapsed / POMODORO_TIME)
    }

    setTimerState('stopped')
  }

  const continueTimer = () => {
    setShowPopup(false)
    setTimerSeconds(EXTRA_TIME)
    setCurrentTimerStartTime(EXTRA_TIME)
    setTimerState('running')

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
          setTimerState('stopped')
          setShowPopup(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const getTimerDisplay = () => {
    const mins = Math.floor(timerSeconds / 60)
    const secs = timerSeconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerRatios = () => {
    const FULL_CIRCLE_MINUTES = 60 * 60
    const elapsed = currentTimerStartTime - timerSeconds
    const elapsedRatio = elapsed / FULL_CIRCLE_MINUTES
    const remainingRatio = timerSeconds / FULL_CIRCLE_MINUTES
    return { elapsedRatio, remainingRatio }
  }

  return {
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
  }
}

