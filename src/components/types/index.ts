import firebase from 'firebase/app';

export interface ILocation {
	latitude: number;
	longitude: number;
}

export interface IBike {
	id?: string;
	model: string;
	color: string;
	weight: string;
	location: ILocation;
	photo: string;
	isAvailable: boolean;
	score?: number;
	totalScore?: number;
}

export interface IReservation {
	id?: string;
	model: string;
	color: string;
	weight: string;
	photo: string;
	startDate: number;
	endDate: number;
}
export interface IUser {
	uid: string;
	email: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
}
