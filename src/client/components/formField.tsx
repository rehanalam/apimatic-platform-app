import type { InputProps } from '@/client/components/ui/input'
import type { TextareaProps } from '@/client/components/ui/textarea'
import { Input } from '@/client/components/ui/input'
import { Textarea } from '@/client/components/ui/textarea'
import { Label } from '@/client/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/client/components/ui/select'
import { Checkbox } from '@/client/components/ui/checkbox'
import { Text } from '@/client/components/ui/text'
import { cn } from '@/client/lib/utils'

interface BaseFieldProps {
  label?: string
  description?: string
  className?: string
  required?: boolean
}

export interface TextFieldProps
  extends
    BaseFieldProps,
    Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id'> {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
}

export interface NumberFieldProps
  extends
    BaseFieldProps,
    Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'type'> {
  min?: number
  max?: number
  step?: number
}

export interface TextAreaFieldProps
  extends
    BaseFieldProps,
    Omit<TextareaProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id'> {
  rows?: number
}

export interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export interface CheckboxFieldProps extends Omit<
  BaseFieldProps,
  'placeholder'
> {
  label: string
}

export const FormFieldComponents = {
  TextField: (field: any, props: TextFieldProps) => (
    <div className={cn('space-y-2', props.className)}>
      {props.label && (
        <Label htmlFor={field.name as string}>
          {props.label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={field.name as string}
        name={field.name as string}
        type={props.type || 'text'}
        value={(field.state.value as string) || ''}
        placeholder={props.placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        autoComplete={props.autoComplete}
        autoFocus={props.autoFocus}
        maxLength={props.maxLength}
        minLength={props.minLength}
        pattern={props.pattern}
      />
      {props.description && (
        <Text size="sm" variant="secondary">
          {props.description}
        </Text>
      )}
      {field.state.meta.errors.length > 0 && (
        <Text size="sm" weight="medium" variant="danger">
          {field.state.meta.errors.join(', ')}
        </Text>
      )}
    </div>
  ),

  NumberField: (field: any, props: NumberFieldProps) => (
    <div className={cn('space-y-2', props.className)}>
      {props.label && (
        <Label htmlFor={field.name as string}>
          {props.label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={field.name as string}
        name={field.name as string}
        type="number"
        value={field.state.value as number}
        placeholder={props.placeholder}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={(e) =>
          field.handleChange(
            e.target.value ? Number(e.target.value) : undefined,
          )
        }
        onBlur={() => field.handleBlur()}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        autoFocus={props.autoFocus}
      />
      {props.description && (
        <Text size="sm" variant="secondary">
          {props.description}
        </Text>
      )}
      {field.state.meta.errors.length > 0 && (
        <Text size="sm" weight="medium" variant="danger">
          {field.state.meta.errors.join(', ')}
        </Text>
      )}
    </div>
  ),

  TextAreaField: (field: any, props: TextAreaFieldProps) => (
    <div className={cn('space-y-2', props.className)}>
      {props.label && (
        <Label htmlFor={field.name as string}>
          {props.label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={field.name as string}
        name={field.name as string}
        value={(field.state.value as string) || ''}
        placeholder={props.placeholder}
        rows={props.rows || 4}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        autoFocus={props.autoFocus}
        maxLength={props.maxLength}
        minLength={props.minLength}
      />
      {props.description && (
        <Text size="sm" variant="secondary">
          {props.description}
        </Text>
      )}
      {field.state.meta.errors.length > 0 && (
        <Text size="sm" weight="medium" variant="danger">
          {field.state.meta.errors.join(', ')}
        </Text>
      )}
    </div>
  ),

  SelectField: (field: any, props: SelectFieldProps) => (
    <div className={cn('space-y-2', props.className)}>
      {props.label && (
        <Label htmlFor={field.name as string}>
          {props.label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select
        value={(field.state.value as string) || ''}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger id={field.name as string} className="w-full">
          <SelectValue placeholder={props.placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {props.description && (
        <Text size="sm" variant="secondary">
          {props.description}
        </Text>
      )}
      {field.state.meta.errors.length > 0 && (
        <Text size="sm" weight="medium" variant="danger">
          {field.state.meta.errors.join(', ')}
        </Text>
      )}
    </div>
  ),

  CheckboxField: (field: any, props: CheckboxFieldProps) => (
    <div className={cn('flex items-center space-x-2', props.className)}>
      <Checkbox
        id={field.name as string}
        checked={(field.state.value as boolean) || false}
        onCheckedChange={(checked) => field.handleChange(!!checked)}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={field.name as string}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {props.label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {props.description && (
          <p className="text-sm text-muted-foreground">{props.description}</p>
        )}
        {field.state.meta.errors.length > 0 && (
          <p className="text-sm font-medium text-destructive">
            {field.state.meta.errors.join(', ')}
          </p>
        )}
      </div>
    </div>
  ),
}
