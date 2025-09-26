import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface CustomDropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: CustomDropdownOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  className = '',
  disabled = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full h-10 px-3 py-2 text-left bg-white border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
            transition-all duration-200 text-sm
            ${disabled 
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
            }
            ${isOpen ? 'border-yellow-400 ring-2 ring-yellow-400/20' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors duration-150
                    flex items-center justify-between
                    ${option.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 hover:bg-yellow-50 hover:text-yellow-900 cursor-pointer'
                    }
                    ${value === option.value ? 'bg-yellow-100 text-yellow-900' : ''}
                  `}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-yellow-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomDropdown