import React, { useEffect, useRef, useState } from 'react'

const TIP_GAP = 12
const TIP_MAX_WIDTH = 220

export const CHART_HEIGHT = 280
export const PAD_TOP = 22
export const PAD_BOTTOM = 28
export const PAD_LEFT = 48
export const PAD_RIGHT = 16

const TIP_TARGET_ATTRIBUTE = 'data-tip-target'

interface TipHandlers {
  onPointerMove: (event: React.PointerEvent) => void
  onPointerDown: (event: React.PointerEvent) => void
  onPointerLeave: (event: React.PointerEvent) => void
  [TIP_TARGET_ATTRIBUTE]: true
}

export interface ChartContext {
  width: number
  tipHandlers: (lines: string[]) => TipHandlers
}

interface Tip {
  x: number
  y: number
  lines: string[]
}

export const linearScale = (d0: number, d1: number, r0: number, r1: number) => (value: number) =>
  r0 + ((value - d0) / (d1 - d0 || 1)) * (r1 - r0)

export function stepTicks(min: number, max: number, step: number) {
  const ticks: number[] = []
  for (let tick = Math.ceil(min / step) * step; tick <= max; tick += step) ticks.push(tick)
  return ticks
}

export default function ChartFrame({
  height = CHART_HEIGHT,
  label,
  children,
}: {
  height?: number
  label: string
  children: (context: ChartContext) => React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const measure = () => setWidth(container.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const isTipOpen = tip !== null
  useEffect(() => {
    if (!isTipOpen) return
    const closeOnOutsideTap = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target?.closest(`[${TIP_TARGET_ATTRIBUTE}]`)) setTip(null)
    }
    document.addEventListener('pointerdown', closeOnOutsideTap)
    return () => document.removeEventListener('pointerdown', closeOnOutsideTap)
  }, [isTipOpen])

  const showTip = (event: React.PointerEvent, lines: string[]) => {
    const container = containerRef.current
    if (!container) return
    const bounds = container.getBoundingClientRect()
    const pointerX = event.clientX - bounds.left
    const pointerY = event.clientY - bounds.top
    const overflowsRight = pointerX + TIP_GAP + TIP_MAX_WIDTH > bounds.width
    const x = overflowsRight ? Math.max(0, pointerX - TIP_GAP - TIP_MAX_WIDTH) : pointerX + TIP_GAP
    setTip({ x, y: pointerY + TIP_GAP, lines: lines.filter(Boolean) })
  }
  const tipHandlers: ChartContext['tipHandlers'] = (lines) => ({
    onPointerMove: (event) => showTip(event, lines),
    // A tap fires pointerdown but no pointermove, and its pointerleave would close the tip straight away.
    onPointerDown: (event) => showTip(event, lines),
    onPointerLeave: (event) => {
      if (event.pointerType === 'mouse') setTip(null)
    },
    [TIP_TARGET_ATTRIBUTE]: true,
  })

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={label} className="block overflow-visible">
          {children({ width, tipHandlers })}
        </svg>
      )}
      {tip && (
        <div
          className="pointer-events-none absolute z-10 rounded border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 shadow-md"
          style={{ left: tip.x, top: tip.y, maxWidth: TIP_MAX_WIDTH }}
        >
          {tip.lines.map((line, index) => (
            <div key={index} className={index === 0 ? 'font-semibold text-gray-900' : undefined}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function TimeAxis({
  ticks,
  y,
  width,
  format,
}: {
  ticks: number[]
  y: (value: number) => number
  width: number
  format: (value: number) => string
}) {
  return (
    <g>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={PAD_LEFT} x2={width - PAD_RIGHT} y1={y(tick)} y2={y(tick)} className="stroke-gray-200" />
          <text x={PAD_LEFT - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-gray-500 text-xs">
            {format(tick)}
          </text>
        </g>
      ))}
    </g>
  )
}
