import React, { ReactNode } from 'react';
import FormField from './FormField';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
}

const Select: React.FC<SelectProps> = ({ id, label, error, className, children, ...props }) => {
    return (
        <FormField id={id} label={label} error={error} required={props.required}>
            <select id={id} className={`input-field ${className ?? ''}`.trim()} {...props}>
                {children}
            </select>
        </FormField>
    );
};

export default Select;
