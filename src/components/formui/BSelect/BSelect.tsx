import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

type BSelectProps = TextFieldProps & {
	name: string;
	options?: any;
};

export const BSelect = ({ name, options, ...otherProps }: BSelectProps) => {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setFieldValue(name, value);
	};

	const configSelect: BSelectProps = {
		...field,
		...otherProps,
		select: true,
		fullWidth: true,
		onChange: handleChange,
		variant: 'outlined',
	};

	if (meta && meta.touched && meta.error) {
		configSelect.error = true;
		configSelect.helperText = meta.error;
	}

	return (
		<TextField {...configSelect}>
			{Object.keys(options).map((item, pos) => {
				return (
					<MenuItem key={pos} value={item}>
						{options[item]}
					</MenuItem>
				);
			})}
		</TextField>
	);
};
