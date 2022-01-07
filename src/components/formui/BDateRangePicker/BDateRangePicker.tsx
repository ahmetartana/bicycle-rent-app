import React from 'react';
import { TextField } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

export interface IDateRange {
	startDate?: Date;
	endDate?: Date;
}

interface RangePickerState {
	startDate: any;
	endDate: any;
	minEndDate: any;
}
interface RangePickerProps {
	// onValueChanged: (range: IDateRange) => void;
	startDateName: string;
	endDateName: string;
}

const isDateGreaterThan = (startDate: string, endDate: string) => {
	return new Date(startDate) > new Date(endDate);
};

export const BDateRangePicker: React.FC<RangePickerProps> = ({
	startDateName,
	endDateName,
	...otherProps
}) => {
	const { setFieldValue } = useFormikContext();
	const [startDateField, startDateFieldMeta] = useField(startDateName);
	const [endDateField, endDateFieldMeta] = useField(endDateName);

	const handlChange = (event: any) => {
		const { value } = event.target;
		setFieldValue(event.target.name, value);
		if (isDateGreaterThan(value, endDateField.value)) {
			setFieldValue(endDateName, value);
		}
	};

	const StartDateComp = () => {
		return (
			<TextField
				{...startDateField}
				id={startDateName}
				name={startDateName}
				label='Start date'
				fullWidth
				variant='outlined'
				margin='normal'
				size='small'
				data-testid='input-start-date'
				type='date'
				InputLabelProps={{ shrink: true }}
				onChange={handlChange}
			/>
		);
	};

	const EndDateComp = () => {
		return (
			<TextField
				{...endDateField}
				name={endDateName}
				id={endDateName}
				label='End date'
				data-testid='input-end-date'
				type='date'
				variant='outlined'
				margin='normal'
				size='small'
				fullWidth
				InputLabelProps={{ shrink: true }}
				inputProps={{
					min: startDateField.value,
				}}
				onChange={handlChange}
			/>
		);
	};

	return (
		<div>
			{/* @ts-ignore */}
			{otherProps.children?.({
				StartDateComp,
				EndDateComp,
			})}
		</div>
	);
};
