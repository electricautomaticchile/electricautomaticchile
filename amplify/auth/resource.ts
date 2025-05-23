import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET')
      },
      callbackUrls: [
        'https://main.d31trp39fgtk7e.amplifyapp.com//profile',
        'https://main.d31trp39fgtk7e.amplifyapp.com//profile'
      ],
      logoutUrls: ['https://main.d31trp39fgtk7e.amplifyapp.com/', 'https://main.d31trp39fgtk7e.amplifyapp.com/'],
    }
  }
});