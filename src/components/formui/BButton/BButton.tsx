import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useFormikContext } from 'formik';

type BSubmitButtonProps = ButtonProps & {
	isloading?: boolean;
	loadingComponent?: any;
};

export const BSubmitButton = ({
	children,
	isloading,
	loadingComponent,
	...otherProps
}: BSubmitButtonProps) => {
	const { submitForm } = useFormikContext();
	const handleSubmit = () => {
		submitForm();
	};
	const configButton: BSubmitButtonProps = {
		variant: 'contained',
		disabled: isloading,
		...otherProps,
		onClick: handleSubmit,
	};

	return (
		<Button {...configButton}>
			{!isloading && children} {isloading && loadingComponent}
		</Button>
	);
};
