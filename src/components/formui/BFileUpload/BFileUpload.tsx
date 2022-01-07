import { useField } from 'formik';
import { Grid, TextField, TextFieldProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

type BFileUploadProps = TextFieldProps & {
	name: string;
	previewUrl?: string;
};

const useStyles = makeStyles({
	imgwrap: {
		position: 'absolute',
		right: 1,
		top: 1,
	},
	imgprev: {
		height: 120,
	},
	fileInput: {
		height: 85,
		lineHeight: 5,
	},
	container: {
		position: 'relative',
	},
});

export const BFileUpload = ({
	name,
	previewUrl,
	...otherProps
}: BFileUploadProps) => {
	const classes = useStyles();
	const [field, meta, helpers] = useField(name!);
	const configTextField: TextFieldProps = {
		...otherProps,
		fullWidth: true,
		error: false,
		helperText: '',
		variant: 'outlined',
		type: 'file',
		onChange: (event) => {
			const InputElement = event.target as HTMLInputElement;
			if (InputElement && InputElement.files) {
				const file = InputElement.files[0];
				helpers.setValue(file);
			}
		},
	};

	if (meta && meta.touched && meta.error) {
		configTextField.error = true;
		configTextField.helperText = meta.error;
	}
	return (
		<Grid container className={classes.container}>
			<Grid item xs={12}>
				<TextField
					inputProps={{ className: classes.fileInput }}
					{...configTextField}
				/>
			</Grid>
			{previewUrl && (
				<Grid className={classes.imgwrap}>
					<img className={classes.imgprev} src={previewUrl}></img>
				</Grid>
			)}
		</Grid>
	);
};
