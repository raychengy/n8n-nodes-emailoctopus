# n8n-nodes-emailoctopus

This is an n8n community node. It lets you use EmailOctopus in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node allows you to manage contacts in your EmailOctopus lists.

- **Contact**
    - Add or Update: Creates a new contact or updates an existing one.
    - Add Tag: Adds a tag to a contact.
    - Find: Finds a contact by their email address.
    - Remove Tag: Removes a tag from a contact.
    - Unsubscribe: Unsubscribes a contact from a list.
    - Update Email: Updates a contact's email address.

## Credentials

To use this node, you need to authenticate using an API key.

1.  Log in to your EmailOctopus account.
2.  Go to the [API documentation page](https://emailoctopus.com/api-documentation/user).
3.  Click on the "Manage API keys" button or navigate directly to the [API keys management page](https://emailoctopus.com/account/api).
4.  Here you can create a new API key or use an existing one.
5.  Copy the API key and paste it into the credentials configuration for the EmailOctopus node in n8n.

For more information, refer to the [EmailOctopus API documentation](https://emailoctopus.com/api-documentation/user).

## Compatibility

Compatible with n8n@1.0.0 or later.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [EmailOctopus API documentation](https://emailoctopus.com/api-documentation)