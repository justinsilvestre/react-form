import { useEffect, useMemo } from "react";
import Form, { FieldErrors, FormFieldProps, useForm } from "./Form";

export default function TextForm({ fields, onSubmit }: { fields: TextFieldOptions[], onSubmit: (fields: {[name: string]: string}) => void }) {
  const { formProps, state, getFieldProps } = useForm({
    initialFieldValues: useMemo(() => {
      const fieldValues: { [name: string]: string } = {}
  
      for (const { name } of fields)
        fieldValues[name] = ''
  
      return fieldValues
    }, [fields]),
    validator: (fieldValues) => {
      const fieldErrors: FieldErrors<typeof fieldValues> = {}

      for (const { validate, name } of fields) {
        const value = fieldValues[name].trim()
        const errors: string[] = fieldErrors[name] = []
        if (validate) {
          if (typeof validate.maxLength === 'number' && value.length > validate.maxLength)
            errors.push(`Please provide a value no longer than ${validate.maxLength} characters.`)
  
          if (validate.email && value && !value.includes('@'))
            errors.push(`Please provide a valid e-mail address.`)
  
          if (validate.required && !value.length)
            errors.push(`Please fill in this field before continuing.`)
        }
      }


      return {
        fieldErrors,
        formError: (Object.values(fieldErrors).flat().length)
          ? 'Sorry! There was a problem processing your submission.'
          : '',
      }
    },
  })

  useEffect(() => {
    if (state.status === 'SUBMISSION_SUCCEEDED')
      onSubmit(state.fields)
  }, [state.status])

  return <Form {...formProps}>
    {state.status === 'SUBMISSION_FAILED' && state.formError && <p>
      {state.formError}
    </p>}
    {fields.map((field) => (
      <TextField label={field.label} key={field.name} fieldProps={getFieldProps(field.name)} />
    ))}
    <button disabled={state.status === 'SUBMISSION_SUCCEEDED'} type="submit">Submit</button>
  </Form>
}

function TextField({ label, fieldProps }: { label: string, fieldProps: FormFieldProps<{ [name: string]: string }, string> }) {
  const { onChange, errors, ...inputProps } = fieldProps

  return <p>
    <label>{label}</label>
    <br />
    <input
      type="text"
      onChange={e => onChange(e.target.value)}
      {...inputProps}
      style={{ width: '100%', fontSize: '1.6em', marginTop: '0.8rem' }}
    />
    {errors && Boolean(errors.length) && <ul style={{ color: 'darkred', padding: '0' }}>
      {errors.map((error) => <li key={error} style={{ listStyleType: 'none' }}>
        {error}
      </li>)}
    </ul>}
  </p>
}

export type TextFieldOptions = {
  name: string,
  label: string,
  validate?: TextFieldValidation
}

type TextFieldValidation = {
  maxLength?: number,
  email?: boolean,
  required?: boolean,
}