"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailOctopus = void 0;
const descriptions_1 = require("./descriptions");
const crypto = __importStar(require("crypto"));
class EmailOctopus {
    constructor() {
        this.description = {
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
                ...descriptions_1.contactOperations,
                ...descriptions_1.contactFields,
            ],
            usableAsTool: true,
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        for (let i = 0; i < length; i++) {
            const operation = this.getNodeParameter('operation', i);
            const listId = this.getNodeParameter('listId', i);
            const email = this.getNodeParameter('email', i);
            const contactId = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
            let response;
            switch (operation) {
                case 'find': {
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'GET',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts/${contactId}`,
                        json: true,
                    });
                    break;
                }
                case 'addUpdate': {
                    const body = { email_address: email };
                    const fields = this.getNodeParameter('fields', i, {});
                    const firstName = this.getNodeParameter('firstName', i);
                    const lastName = this.getNodeParameter('lastName', i);
                    if (firstName)
                        fields.FirstName = firstName;
                    if (lastName)
                        fields.LastName = lastName;
                    if (Object.keys(fields).length > 0)
                        body.fields = fields;
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'PUT',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts`,
                        body,
                        json: true,
                    });
                    break;
                }
                case 'unsubscribe': {
                    const body = { status: 'unsubscribed' };
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'PUT',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts/${contactId}`,
                        body,
                        json: true,
                    });
                    break;
                }
                case 'addTag': {
                    const addTag = this.getNodeParameter('tag', i);
                    const body = { tags: [addTag] };
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'POST',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts/${contactId}/tags`,
                        body,
                        json: true,
                    });
                    break;
                }
                case 'removeTag': {
                    const removeTag = this.getNodeParameter('tag', i);
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'DELETE',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts/${contactId}/tags/${removeTag}`,
                        json: true,
                    });
                    break;
                }
                case 'updateEmail': {
                    const newEmail = this.getNodeParameter('newEmail', i);
                    const oldContact = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'GET',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts/${contactId}`,
                        json: true,
                    });
                    const createBody = {
                        email_address: newEmail,
                        fields: oldContact.fields,
                        tags: oldContact.tags,
                        status: oldContact.status,
                    };
                    const newContact = await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'POST',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts`,
                        body: createBody,
                        json: true,
                    });
                    await this.helpers.httpRequestWithAuthentication.call(this, 'emailOctopusApi', {
                        method: 'DELETE',
                        url: `https://api.emailoctopus.com/1.6/lists/${listId}/contacts/${contactId}`,
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
exports.EmailOctopus = EmailOctopus;
//# sourceMappingURL=EmailOctopus.node.js.map