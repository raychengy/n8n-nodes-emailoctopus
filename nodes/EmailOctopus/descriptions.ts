
import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Add or Update',
				value: 'addUpdate',
				description: 'Add or update a contact',
				action: 'Add or update a contact',
			},
			{
				name: 'Add Tag',
				value: 'addTag',
				description: 'Add a tag to a contact',
				action: 'Add a tag to a contact',
			},
			{
				name: 'Find',
				value: 'find',
				description: 'Find a contact by email address',
				action: 'Find a contact by email address',
			},
			{
				name: 'Remove Tag',
				value: 'removeTag',
				description: 'Remove a tag from a contact',
				action: 'Remove a tag from a contact',
			},
			{
				name: 'Unsubscribe',
				value: 'unsubscribe',
				description: 'Unsubscribe a contact',
				action: 'Unsubscribe a contact',
			},
			{
				name: 'Update Email',
				value: 'updateEmail',
				description: "Update a contact's email address",
				action: 'Update a contact s email address',
			},
		],
		default: 'addUpdate',
	},
];

export const contactFields: INodeProperties[] = [
	// listId
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the list to add the contact to',
	},
	// email
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		required: true,
		description: 'Email address of the contact',
	},
	// firstName
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['addUpdate'],
			},
		},
		description: 'First name of the contact',
	},
	// lastName
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['addUpdate'],
			},
		},
		description: 'Last name of the contact',
	},
	// fields
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				operation: ['addUpdate'],
			},
		},
		description: 'An object of merge fields to create or update',
	},
	// tag
	{
		displayName: 'Tag',
		name: 'tag',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['addTag', 'removeTag'],
			},
		},
		description: 'The tag to add or remove',
	},
	// newEmail
	{
		displayName: 'New Email',
		name: 'newEmail',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['updateEmail'],
			},
		},
		description: 'The new email address for the contact',
	},
];
