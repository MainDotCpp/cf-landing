import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface FormFieldProps {
  label: string
  value: string
  disabled?: boolean
  onChange?: (value: string) => void
  placeholder?: string
  type?: 'text' | 'textarea'
  rows?: number
  className?: string
}

export function FormField({
  label,
  value,
  disabled = false,
  onChange,
  placeholder,
  type = 'text',
  rows = 3,
  className = '',
}: FormFieldProps) {
  const isEditable = !disabled

  if (type === 'textarea') {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        {isEditable
          ? (
              <Textarea
                value={value}
                onChange={e => onChange?.(e.target.value)}
                rows={rows}
                className="font-mono text-sm"
                placeholder={placeholder}
              />
            )
          : (
              <pre className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-sm overflow-x-auto">
                {value || '(空)'}
              </pre>
            )}
      </div>
    )
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <Input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={!isEditable}
        className={!isEditable ? 'bg-slate-50' : ''}
        placeholder={placeholder}
      />
    </div>
  )
}
