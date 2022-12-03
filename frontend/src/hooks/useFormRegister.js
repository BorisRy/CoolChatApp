import { useEffect, useState } from "react"

export const useForm = (initialState, callBack) => {

    const [fields, setFields] = useState(initialState)

    useEffect(() => {
        if (callBack) callBack(fields)
    }, [fields])

    const handleChange = async ({ target }) => {
        const field = target.name
        const value = target.type === 'number' ? (+target.value || '') : target.value
        setFields(prevFields => ({ ...prevFields, [field]: value }))
    }

    const register = (field, type, placeholder) => {
        return {
            name: field,
            id: field,
            onChange: handleChange,
            type,
            value: fields[field],
            placeholder
        }
    }

    return [register, setFields, fields]
}