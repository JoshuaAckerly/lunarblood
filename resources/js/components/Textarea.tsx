import React from 'react';
import FormField from './FormField';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
    error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ id, label, error, className, ...props }) => {
    return (
        <FormField id={id} label={label} error={error} required={props.required}>
            <textarea id={id} className={`input-field ${className ?? ''}`.trim()} {...props} />
        </FormField>
    );
};

export default Textarea;
