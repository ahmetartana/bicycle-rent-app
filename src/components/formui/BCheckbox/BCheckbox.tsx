import React from 'react';
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	CheckboxProps,
} from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

type BCheckboxProps = CheckboxProps & {
	name: string;
	label: string;
};

export const BCheckbox = ({ name, label, ...otherProps }: BCheckboxProps) => {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;
		setFieldValue(name, checked);
	};

	const configCheckbox = {
		...field,
		onChange: handleChange,
		checked: field.value,
	};

	const configFormControl = {
		error: false,
	};
	if (meta && meta.touched && meta.error) {
		configFormControl.error = true;
	}
	return (
		<FormControl {...configFormControl}>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox {...configCheckbox} />}
					label={label}
				/>
			</FormGroup>
		</FormControl>
	);
};
