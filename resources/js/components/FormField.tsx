import React, { ReactNode } from 'react';

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, error, required = false, children, className }) => {
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-2 block text-sm font-medium">
                {label}
                {required && <span className="ml-1 text-[var(--destructive)]">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-[var(--destructive)]">{error}</p>}
        </div>
    );
};

export default FormField;
