'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const spaceRight = window.innerWidth - rect.left
    setAlignRight(spaceRight < 320)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, updatePosition])

  return (
    <div ref={ref} className="relative inline-flex ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-[10px] font-bold flex items-center justify-center leading-none"
      >
        ?
      </button>
      {open && (
        <div
          ref={popupRef}
          className={`absolute z-50 bottom-full mb-2 w-72 sm:w-80 p-3 bg-gray-900 text-white text-xs leading-relaxed rounded-lg shadow-lg ${
            alignRight ? 'right-0' : 'left-0'
          }`}
        >
          {text}
          <div className={`absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 ${
            alignRight ? 'right-4' : 'left-4'
          }`} />
        </div>
      )}
    </div>
  )
}
