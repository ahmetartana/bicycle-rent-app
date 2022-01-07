import React from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { useField, useFormikContext } from 'formik';

type BSliderProps = {
	name: string;
	min: number;
	max: number;
	step: number;
	label: string;
};

export const BSlider = ({
	name,
	min,
	max,
	step,
	label,
	...otherProps
}: BSliderProps) => {
	const { setFieldValue } = useFormikContext();
	const [field, metam, fieldHelper] = useField(name);

	const handleChange = (event: any, value: any) => {
		setFieldValue(name, value);
	};

	const configSelect = {
		...field,
		...otherProps,
		onChange: handleChange,
		min,
		max,
		name,
		step,
	};

	return (
		<div>
			<Typography id='range-slider' gutterBottom>
				{label}
			</Typography>
			<Slider
				valueLabelDisplay='auto'
				aria-labelledby='range-slider'
				defaultValue={field.value}
				color='primary'
				marks
				{...configSelect}
			/>
		</div>
	);
};
