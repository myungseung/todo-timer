import { useEffect, useRef } from 'react'

export const Timer = ({ isRunning, timerRatios, timerDisplay }) => {
  const ticksContainerRef = useRef(null)

  useEffect(() => {
    if (ticksContainerRef.current && ticksContainerRef.current.children.length === 0) {
      for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div')
        tick.className = i % 5 === 0
          ? 'absolute bg-zinc-600 left-1/2 w-[3px] h-[15px] -ml-[1.5px] -top-[15px]'
          : 'absolute bg-zinc-700 left-1/2 w-[2px] h-[10px] -ml-[1px] -top-[10px]'
        tick.style.transform = `rotate(${i * 6 - 60}deg)`
        tick.style.transformOrigin = i % 5 === 0 ? '50% 140px' : '50% 135px'
        ticksContainerRef.current.appendChild(tick)
      }
    }
  }, [])

  const { backgroundRatio, elapsedRatio, remainingRatio } = timerRatios

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <div className="w-[250px] h-[250px] relative flex-shrink-0">
        <table
          className="charts-css pie hide-data bg-zinc-950"
          style={{ background: 'rgb(9, 9, 11)' }}
        >
          <tbody style={{ background: 'rgb(9, 9, 11)', transform: 'scaleX(-1) rotate(0deg)' }}>
            <tr style={{ '--color': 'rgb(9, 9, 11)' }}>
              <td style={{ '--start': '0', '--end': (backgroundRatio + elapsedRatio).toFixed(4) }}>
                <span className="data"></span>
              </td>
            </tr>
            <tr style={{ '--color': '#ef4444' }}>
              <td style={{ '--start': (backgroundRatio + elapsedRatio).toFixed(4), '--end': '1' }}>
                <span className="data"></span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" ref={ticksContainerRef}></div>
      </div>
      <div className={`text-center mt-6 text-xl font-semibold tabular-nums transition-colors duration-100 flex-shrink-0 ${
        isRunning ? 'text-red-500' : 'text-zinc-400'
      }`}>
        {timerDisplay}
      </div>
    </div>
  )
}

