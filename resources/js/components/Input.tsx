import React from 'react';
import FormField from './FormField';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ id, label, error, className, ...props }) => {
    return (
        <FormField id={id} label={label} error={error} required={props.required}>
            <input id={id} className={`input-field ${className ?? ''}`.trim()} {...props} />
        </FormField>
    );
};

export default Input;
