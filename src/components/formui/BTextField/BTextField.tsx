import { useField } from 'formik';
import { TextField, TextFieldProps } from '@material-ui/core';

type BTextFieldProps = TextFieldProps & {
	name: string;
};

export const BTextField = ({ name, ...otherProps }: BTextFieldProps) => {
	const [field, meta] = useField(name);
	const configTextField: BTextFieldProps = {
		...field,
		...otherProps,
		fullWidth: true,
		error: false,
		helperText: '',
		variant: 'outlined',
	};

	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}
	return <TextField {...configTextField} />;
};
