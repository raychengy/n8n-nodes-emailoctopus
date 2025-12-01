import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { contactFields, contactOperations } from './descriptions';
import * as crypto from 'crypto';

enum ContactStatus {
	Subscribed = 'subscribed',
	Unsubscribed = 'unsubscribed',
	Pending = 'pending',
}

interface EmailOctopusRequestBody {
	email_address?: string;
	first_name?: string;
	last_name?: string;
	fields?: Record<string, unknown>;
	status?: ContactStatus;
	tags?: string[];
}

export class EmailOctopus implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EmailOctopus',
		name: 'emailOctopus',
		icon: 'file:../../icons/emailoctopus.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with the EmailOctopus API',
		defaults: {
			name: 'EmailOctopus',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'emailOctopusApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
			},
			...contactOperations,
			...contactFields,
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		for (let i = 0; i < length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const listId = this.getNodeParameter('listId', i) as string;
			const email = this.getNodeParameter('email', i) as string;
			const contactId = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
			let response;

			switch (operation) {
				case 'find': {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'GET',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}`,
							json: true,
						},
					);
					break;
				}
				case 'addUpdate': {
					const body: EmailOctopusRequestBody = { email_address: email };
					const fields = this.getNodeParameter('fields', i, '{}') as string;
					const fieldsJson: Record<string, string | string[] | number | null> = JSON.parse(fields);

					const firstName = this.getNodeParameter('firstName', i) as string;
					const lastName = this.getNodeParameter('lastName', i) as string;

					fieldsJson.FirstName = firstName;
					fieldsJson.LastName = lastName;

					body.fields = fieldsJson;
					body.status = this.getNodeParameter(
						'status',
						i,
						ContactStatus.Subscribed,
					) as ContactStatus;

					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'PUT',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts`,
							body,
							json: true,
						},
					);
					break;
				}
				case 'unsubscribe': {
					const body: EmailOctopusRequestBody = { status: ContactStatus.Unsubscribed };
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'PUT',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}`,
							body,
							json: true,
						},
					);
					break;
				}
				case 'addTag': {
					const addTag = this.getNodeParameter('tag', i) as string;
					const body: EmailOctopusRequestBody = { tags: [addTag] };
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'POST',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}/tags`,
							body,
							json: true,
						},
					);
					break;
				}
				case 'removeTag': {
					const removeTag = this.getNodeParameter('tag', i) as string;
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'DELETE',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}/tags/${removeTag}`,
							json: true,
						},
					);
					break;
				}
				case 'updateEmail': {
					const newEmail = this.getNodeParameter('newEmail', i) as string;

					// 1. Get old contact
					const oldContact = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'GET',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}`,
							json: true,
						},
					);

					// 2. Create new contact
					const createBody: EmailOctopusRequestBody = {
						email_address: newEmail,
						fields: oldContact.fields,
						tags: oldContact.tags,
						status: oldContact.status,
					};
					const newContact = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'emailOctopusApi',
						{
							method: 'POST',
							url: `https://api.emailoctopus.com/lists/${listId}/contacts`,
							body: createBody,
							json: true,
						},
					);

					// 3. Delete old contact
					await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
						method: 'DELETE',
						url: `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}`,
						json: true,
					});

					response = newContact;
					break;
				}
			}

			returnData.push({ json: response });
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
