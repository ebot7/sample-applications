export interface IFacebookEvent {
	object: string;
	entry: Array<IEntry>;
}

interface IEntry {
	id: string;
	messaging: Array<IMessaging>;
}

interface IMessaging {
	sender: ISender;
	recipient: IRecipient;
	message?: {
		text: string;
	};
	postback?: {
		title: string;
		payload: string;
	}
}

interface ISender {
	id: string;
}

interface IRecipient {
	id: string;
}