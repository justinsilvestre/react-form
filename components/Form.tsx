import React, { PropsWithChildren, Reducer, useReducer } from "react"

type Props = ReturnType<typeof useForm>['formProps']

export default function Form({ children, ...formProps }: PropsWithChildren<Props>) {
  const { onSubmit } = formProps
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  )
}


export function useForm<Fields>({ initialFieldValues, validator }: {
  initialFieldValues: Fields,
  validator: (state: Fields) => ValidationResult<Fields>,
}) {
  const reducer: Reducer<FormState<Fields>, FormAction<Fields>> = formReducer

  const [state, dispatch] = useReducer(reducer, initialFieldValues, (initialFields) => {
    const { formError, fieldErrors } = validator(initialFields)
    const initialState: FormState<Fields> = {
      fields: initialFields,
      formError,
      fieldErrors,
      fieldsTouched: {},
      status: 'INITIAL',
    }
    return initialState
  })

  return {
    state,
    formProps: {
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fieldErrors = Object.values(state.fieldErrors).flat().filter(error => error)
        if (fieldErrors.length || state.formError)
          dispatch({ type: 'SUBMIT_FORM_FAILURE' })
        else
          dispatch({ type: 'SUBMIT_FORM_SUCCESS' })
      },
    },
    getFieldProps<FieldName extends keyof Fields>(fieldName: FieldName) {
      const errors: string[] | undefined = state.fieldErrors[fieldName]
      const fieldProps: FormFieldProps<Fields, FieldName> = {
        name: fieldName,
        value: state.fields[fieldName],
        errors: state.fieldsTouched[fieldName] && errors ? errors : [],
        disabled: state.status === 'SUBMISSION_SUCCEEDED',
        onChange: (value: Fields[FieldName]) => {
          const fieldValues = {...state.fields, [fieldName]: value}
          dispatch({ type: 'SET_FIELD_VALUES', fieldValues, validationResult: validator(fieldValues) })
        },
        onBlur: () => dispatch({ type: 'TOUCH_FIELD', fieldName: fieldName as string })
      }
      return fieldProps
    },
  }
}

type FormState<F> = {
  fields: F,
  fieldErrors: FieldErrors<F>,
  fieldsTouched: { [K in keyof F]?: boolean }
  formError: string,
  status: FormStatus
}
export type FieldErrors<F> = { [K in keyof F]?: string[] }
export type FormStatus = 'INITIAL' | 'SUBMISSION_FAILED' | 'SUBMISSION_SUCCEEDED'

export type FormFieldProps<Fields, N extends keyof Fields> = {
  onChange: (newValue: Fields[N]) => void,
  onBlur: () => void,
  name: N,
  value: Fields[N],
  errors: string[],
  disabled: boolean,
}

type FormAction<F> =
  | { type: 'SUBMIT_FORM_SUCCESS' }
  | { type: 'SUBMIT_FORM_FAILURE' }
  | { type: 'TOUCH_FIELD', fieldName: string }
  | { type: 'SET_FIELD_VALUES', fieldValues: F, validationResult: ValidationResult<F> }
type ValidationResult<FormFields> = {
  fieldErrors: FieldErrors<FormFields>,
  formError: string
}


function formReducer<F>(state: FormState<F>, action: FormAction<F>): FormState<F> {
  switch (action.type) {
    case 'SUBMIT_FORM_SUCCESS':
      return {
        ...state,
        status: 'SUBMISSION_SUCCEEDED',
      }
    case 'SUBMIT_FORM_FAILURE':{
      const fieldsTouched: FormState<F>['fieldsTouched'] = {}
      for (const name in state.fields) fieldsTouched[name] = true

      return {
        ...state,
        status: 'SUBMISSION_FAILED',
        fieldsTouched,
      }
    }
    case 'SET_FIELD_VALUES':
      return {
        ...state,
        fields: action.fieldValues,
        formError: action.validationResult.formError,
        fieldErrors: action.validationResult.fieldErrors,
      }
    case 'TOUCH_FIELD':
      return {
        ...state,
        fieldsTouched: {
          ...state.fieldsTouched,
          [action.fieldName]: true,
        }
      }
    
    default:
      return state
  }
}

