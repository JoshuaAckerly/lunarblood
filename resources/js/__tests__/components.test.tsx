import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it } from 'vitest';
import FormField from '@/components/FormField';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';

describe('FormField', () => {
    it('renders label and children', () => {
        render(
            <FormField id="test-field" label="Test Label">
                <input id="test-field" />
            </FormField>,
        );
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders required indicator when required=true', () => {
        render(
            <FormField id="test-field" label="Email" required>
                <input id="test-field" />
            </FormField>,
        );
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not render required indicator when required=false', () => {
        render(
            <FormField id="test-field" label="Email">
                <input id="test-field" />
            </FormField>,
        );
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        render(
            <FormField id="test-field" label="Email" error="This field is required">
                <input id="test-field" />
            </FormField>,
        );
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('does not render error message when no error prop', () => {
        render(
            <FormField id="test-field" label="Email">
                <input id="test-field" />
            </FormField>,
        );
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
});

describe('Input', () => {
    it('renders a labeled input', () => {
        render(<Input id="name" label="Full Name" />);
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        render(<Input id="email" label="Email" error="Invalid email address" />);
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('passes through input attributes', async () => {
        const user = userEvent.setup();
        render(<Input id="username" label="Username" placeholder="Enter username" />);
        const input = screen.getByLabelText('Username');
        expect(input).toHaveAttribute('placeholder', 'Enter username');
        await user.type(input, 'johndoe');
        expect(input).toHaveValue('johndoe');
    });

    it('renders required indicator when required', () => {
        render(<Input id="name" label="Name" required />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });
});

describe('Select', () => {
    it('renders a labeled select', () => {
        render(
            <Select id="status" label="Status">
                <option value="on-sale">On Sale</option>
                <option value="sold-out">Sold Out</option>
            </Select>,
        );
        expect(screen.getByLabelText('Status')).toBeInTheDocument();
    });

    it('renders all child options', () => {
        render(
            <Select id="status" label="Status">
                <option value="coming-soon">Coming Soon</option>
                <option value="on-sale">On Sale</option>
                <option value="sold-out">Sold Out</option>
            </Select>,
        );
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Coming Soon')).toBeInTheDocument();
        expect(screen.getByText('On Sale')).toBeInTheDocument();
        expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        render(
            <Select id="status" label="Status" error="Please select a status">
                <option value="on-sale">On Sale</option>
            </Select>,
        );
        expect(screen.getByText('Please select a status')).toBeInTheDocument();
    });

    it('can be changed by user', async () => {
        const user = userEvent.setup();
        render(
            <Select id="status" label="Status">
                <option value="coming-soon">Coming Soon</option>
                <option value="on-sale">On Sale</option>
            </Select>,
        );
        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'on-sale');
        expect(select).toHaveValue('on-sale');
    });
});

describe('Textarea', () => {
    it('renders a labeled textarea', () => {
        render(<Textarea id="bio" label="Biography" />);
        expect(screen.getByLabelText('Biography')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
        render(<Textarea id="bio" label="Biography" error="Description is too short" />);
        expect(screen.getByText('Description is too short')).toBeInTheDocument();
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(<Textarea id="bio" label="Biography" />);
        const textarea = screen.getByLabelText('Biography');
        await user.type(textarea, 'This is my biography.');
        expect(textarea).toHaveValue('This is my biography.');
    });

    it('passes through textarea attributes', () => {
        render(<Textarea id="bio" label="Biography" rows={5} placeholder="Tell us about yourself" />);
        const textarea = screen.getByLabelText('Biography');
        expect(textarea).toHaveAttribute('rows', '5');
        expect(textarea).toHaveAttribute('placeholder', 'Tell us about yourself');
    });
});
