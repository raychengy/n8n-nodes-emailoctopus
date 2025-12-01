import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class EmailOctopusApi implements ICredentialType {
	name = 'emailOctopusApi';

	displayName = 'EmailOctopus API';

	icon: Icon = {
		light: 'file:../icons/emailoctopus.svg',
		dark: 'file:../icons/emailoctopus.dark.svg',
	};

	documentationUrl = 'https://emailoctopus.com/api-documentation/v2#section/Authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.emailoctopus.com',
			url: '/lists',
			method: 'GET',
		},
	};
}
