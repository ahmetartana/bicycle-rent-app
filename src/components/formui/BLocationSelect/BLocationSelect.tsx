import React, { useState } from 'react';
import { useField } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
	MapContainer,
	Marker,
	TileLayer,
	Popup,
	useMapEvents,
} from 'react-leaflet';
import FormHelperText from '@material-ui/core/FormHelperText';

interface BLocationSelectProps {
	name: string;
}
function LocationSelector({ onAddMarker }: any) {
	const map = useMapEvents({
		click: (event) => {
			onAddMarker(event.latlng);
		},
	});
	return null;
}

export const BLocationSelect = ({ name }: BLocationSelectProps) => {
	const [field, meta, helpers] = useField(name);
	let errorStyles: any = { border: '1px solid #f44336' };
	let hasError = meta && meta.touched && meta.error;
	return (
		<>
			<div style={hasError ? errorStyles : {}}>
				<MapContainer
					center={{ lat: 51.505, lng: 0.09 }}
					zoom={13}
					scrollWheelZoom={false}
					style={{ height: 200 }}
				>
					<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
					{field.value && <Marker position={field.value}></Marker>}

					<LocationSelector
						onAddMarker={(loc: any) => {
							helpers.setValue(loc);
						}}
					/>
				</MapContainer>
			</div>
			{hasError && (
				<FormHelperText error={true}>Location is required</FormHelperText>
			)}
		</>
	);
};
