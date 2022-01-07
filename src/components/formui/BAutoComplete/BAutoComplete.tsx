import { TextField, TextFieldProps } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useField, useFormikContext } from 'formik';
import React from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

interface IOptions {
	title: string;
	value: string;
}

type BAutoCompleteProps = TextFieldProps & {
	name: string;
	options: IOptions[];
};

export const BAutoComplete = ({
	name,
	options,
	...otherProps
}: BAutoCompleteProps) => {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);

	const handleChange = (event: React.ChangeEvent<{}>, _value: IOptions[]) => {
		setFieldValue(
			name,
			_value.map((s) => s.value)
		);
	};

	const configSelect = {
		...field,
		...otherProps,
	};

	if (meta && meta.touched && meta.error) {
		configSelect.error = true;
		configSelect.helperText = meta.error;
	}

	return (
		<Autocomplete
			multiple
			id='checkboxes-tags-demo'
			options={options}
			size='small'
			disableCloseOnSelect
			ListboxProps={{ size: 'small' }}
			onChange={handleChange}
			getOptionLabel={(option: IOptions) => option.title}
			renderOption={(option, { selected }) => (
				<React.Fragment>
					<Checkbox
						size='small'
						icon={icon}
						checkedIcon={checkedIcon}
						style={{ marginRight: 8 }}
						checked={selected}
					/>
					{option.title}
				</React.Fragment>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					margin='normal'
					variant='outlined'
					label='Color'
					placeholder='Color'
				/>
			)}
		/>
	);
};
