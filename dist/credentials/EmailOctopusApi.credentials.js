"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailOctopusApi = void 0;
class EmailOctopusApi {
    constructor() {
        this.name = 'emailOctopusApi';
        this.displayName = 'EmailOctopus API';
        this.icon = { light: 'file:../icons/emailoctopus.svg', dark: 'file:../icons/emailoctopus.dark.svg' };
        this.documentationUrl = 'https://emailoctopus.com/api-documentation/v2#section/Authentication';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=token {{$credentials?.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://api.emailoctopus.com',
                url: '/api/v2/lists',
                method: 'GET',
            },
        };
    }
}
exports.EmailOctopusApi = EmailOctopusApi;
//# sourceMappingURL=EmailOctopusApi.credentials.js.map