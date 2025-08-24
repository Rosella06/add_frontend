import React from 'react'
import { IoBackspaceOutline } from 'react-icons/io5'

interface NumpadProps {
  value: string
  onChange: (newValue: string) => void
  maxLength?: number
}

const Numpad: React.FC<NumpadProps> = ({ value, onChange, maxLength = 64 }) => {
  const handleNumberClick = (num: string) => {
    if (value.length < maxLength) {
      onChange(value + num)
    }
  }

  const handleBackspace = () => {
    onChange(value.slice(0, -1))
  }

  const handleClearAll = () => {
    onChange('')
  }

  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='input w-full h-15 rounded-3xl flex items-center justify-center text-2xl tracking-widest font-mono select-none overflow-hidden'>
        {value.split('').map((_, index) => (
          <span key={index}>•</span>
        ))}
      </div>

      <div className='grid grid-cols-3 gap-3 w-full max-w-xs'>
        {numberButtons.map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className='btn btn-ghost text-2xl font-bold h-20 rounded-3xl'
          >
            {num}
          </button>
        ))}

        <button
          onClick={handleClearAll}
          className='btn btn-ghost text-primary text-2xl font-bold h-20 rounded-3xl flex items-center justify-center'
        >
          <span>CC</span>
        </button>

        <button
          onClick={() => handleNumberClick('0')}
          className='btn btn-ghost text-2xl font-bold h-20 rounded-3xl'
        >
          0
        </button>

        <button
          onClick={handleBackspace}
          className='btn btn-ghost text-2xl font-bold h-20 rounded-3xl flex items-center justify-center'
        >
          <IoBackspaceOutline size={32} className='text-error' />
        </button>
      </div>
    </div>
  )
}

export default Numpad
