import React from 'react';
import { TextField } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

interface RangePickerProps {
	startName: string;
	startLabel: string;
	endName: string;
	endLabel: string;
}

const StartComp = (props: any) => {
	return (
		<TextField
			{...props}
			fullWidth
			variant='outlined'
			margin='normal'
			size='small'
			data-testid='input-start-date'
			type='number'
		/>
	);
};

const EndComp = (props: any) => {
	return (
		<TextField
			{...props}
			data-testid='input-end-date'
			type='number'
			variant='outlined'
			margin='normal'
			size='small'
			fullWidth
			inputProps={{
				min: props.min,
			}}
		/>
	);
};

export const BNumRangePicker: React.FC<RangePickerProps> = ({
	startName,
	endName,
	startLabel,
	endLabel,
	...otherProps
}) => {
	const { setFieldValue, setFieldError, setTouched } = useFormikContext();
	const [startField, startFieldMeta, startFieldHelpers] = useField(startName);
	const [endField, endFieldMeta, endFieldHelpers] = useField(endName);

	const handleChangeStart = (event: any) => {
		const { value } = event.target;
		setFieldValue(startName, value);
		// if (parseInt(value) > parseInt(endField.value)) {
		// 	setFieldValue(endName, value);
		// }
	};
	const handleChangeEnd = (event: any) => {
		const { value } = event.target;
		endFieldHelpers.setValue(value);
		if (value && parseInt(startField.value) > value) {
			console.log('error occured');
			setFieldError(endName, 'Error');
			setTouched(true);
		}
	};

	const startCompProps = {
		...startField,
		id: startName,
		name: startName,
		label: startLabel,
		onChange: handleChangeStart,
	};
	const endCompProps: any = {
		...endField,
		id: endName,
		name: endName,
		label: endLabel,
		onChange: handleChangeEnd,
	};
	console.log(endFieldMeta);
	if (endFieldMeta && endFieldMeta.error) {
		console.log('end field error');
		endCompProps.error = true;
		endCompProps.helperText = endFieldMeta.error;
	}

	//@ts-ignore
	return otherProps.children?.({
		StartComp,
		startCompProps,
		EndComp,
		endCompProps,
	});
};
