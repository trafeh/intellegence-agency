import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

export const COUNTRY_DIAL_CODES = [
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Morocco / Maroc', placeholder: '6 00 00 00 00' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France', placeholder: '6 12 34 56 78' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain / España', placeholder: '612 345 678' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE / الإمارات', placeholder: '50 123 4567' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia / السعودية', placeholder: '50 123 4567' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'USA / Canada', placeholder: '202 555 0199' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom', placeholder: '7911 123456' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany / Deutschland', placeholder: '151 1234567' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy / Italia', placeholder: '312 345 6789' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgium / Belgique', placeholder: '470 12 34 56' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland / Suisse', placeholder: '78 123 45 67' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algeria / الجزائر', placeholder: '550 12 34 56' },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisia / تونس', placeholder: '20 123 456' },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Senegal / Sénégal', placeholder: '77 123 45 67' },
  { code: 'CI', dial: '+225', flag: '🇨🇮', name: "Côte d'Ivoire", placeholder: '07 12 34 56 78' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey / Türkiye', placeholder: '532 123 45 67' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt / مصر', placeholder: '100 123 4567' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar / قطر', placeholder: '3312 3456' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China / 中国', placeholder: '138 0013 8000' },
]

export default function PhoneInputField({
  value = '',
  onChange,
  required = false,
  placeholder,
  className = '',
  defaultCountryCode = 'MA',
  id,
  name = 'phone',
}) {
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  // Determine initial country and local digits
  const parseValue = (raw) => {
    if (!raw) {
      const defaultC = COUNTRY_DIAL_CODES.find(c => c.code === defaultCountryCode) || COUNTRY_DIAL_CODES[0]
      return { country: defaultC, digits: '' }
    }

    const trimmed = String(raw).trim()
    if (trimmed.startsWith('+')) {
      // Find longest matching dial code prefix
      const sortedByLength = [...COUNTRY_DIAL_CODES].sort((a, b) => b.dial.length - a.dial.length)
      for (const c of sortedByLength) {
        if (trimmed.startsWith(c.dial)) {
          const digits = trimmed.slice(c.dial.length).trim()
          return { country: c, digits }
        }
      }
    }

    const defaultC = COUNTRY_DIAL_CODES.find(c => c.code === defaultCountryCode) || COUNTRY_DIAL_CODES[0]
    return { country: defaultC, digits: trimmed }
  }

  const initial = parseValue(value)
  const [selectedCountry, setSelectedCountry] = useState(initial.country)
  const [digits, setDigits] = useState(initial.digits)

  // Keep in sync if parent changes value externally
  useEffect(() => {
    const parsed = parseValue(value)
    if (parsed.digits !== digits || parsed.country.code !== selectedCountry.code) {
      setSelectedCountry(parsed.country)
      setDigits(parsed.digits)
    }
  }, [value])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen])

  const handleSelectCountry = (country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchFilter('')

    const full = digits ? `${country.dial} ${digits.trim()}` : ''
    onChange?.(full)
  }

  const handleDigitsChange = (e) => {
    const inputVal = e.target.value

    // Auto-detect if user typed or pasted an international prefix starting with '+'
    if (inputVal.startsWith('+')) {
      const parsed = parseValue(inputVal)
      setSelectedCountry(parsed.country)
      setDigits(parsed.digits)
      onChange?.(`${parsed.country.dial} ${parsed.digits}`)
      return
    }

    // Clean leading zero if user typed e.g. 06... while dial code is active
    let cleanedDigits = inputVal
    if (cleanedDigits.startsWith('0') && cleanedDigits.length > 1) {
      cleanedDigits = cleanedDigits.slice(1)
    }

    setDigits(cleanedDigits)
    const full = cleanedDigits ? `${selectedCountry.dial} ${cleanedDigits.trim()}` : ''
    onChange?.(full)
  }

  const filteredCountries = COUNTRY_DIAL_CODES.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.dial.includes(searchFilter) ||
    c.code.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div ref={containerRef} className={`relative ${className}`} dir="ltr">
      <div className="relative flex items-center w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] focus-within:border-brand-500 focus-within:bg-white dark:focus-within:bg-white/[0.05] transition-all">
        {/* Dial code prefix + country flag */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-l-xl transition-colors shrink-0"
          title={`${selectedCountry.name} (${selectedCountry.dial})`}
          aria-expanded={isOpen}
        >
          <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
            {selectedCountry.dial}
          </span>
          <span className="text-base select-none leading-none">
            {selectedCountry.flag}
          </span>
          <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 dark:bg-white/10 shrink-0" />

        {/* Phone number digits input */}
        <input
          id={id}
          name={name}
          type="tel"
          required={required}
          value={digits}
          onChange={handleDigitsChange}
          placeholder={placeholder || selectedCountry.placeholder}
          className="w-full px-3 py-2.5 bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Country selection dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-72 max-h-64 overflow-y-auto rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 shadow-2xl p-2 animate-in fade-in slide-in-from-top-1">
          {/* Search filter */}
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search country or code..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* List of countries */}
          <div className="space-y-0.5">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = selectedCountry.code === c.code
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-brand-600 dark:text-brand-400 shrink-0 w-12">
                        {c.dial}
                      </span>
                      <span className="text-base select-none shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-brand-600 shrink-0 ml-2" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
