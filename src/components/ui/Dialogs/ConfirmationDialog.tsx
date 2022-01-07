import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { useState } from 'react';

export interface ConfirmationDialogProps {
	message: string;
	open: boolean;
	onClose: (value: boolean) => void;
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {
	const { onClose, message, open, ...other } = props;
	const handleCancel = () => {
		onClose(false);
	};

	const handleOk = () => {
		onClose(true);
	};

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth='xs'
			aria-labelledby='confirmation-dialog-title'
			open={open}
			{...other}
		>
			<DialogTitle id='confirmation-dialog-title'>Are you sure?</DialogTitle>
			<DialogContent dividers>{message}</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={handleCancel} color='secondary'>
					Cancel
				</Button>
				<Button onClick={handleOk} color='primary'>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
};
