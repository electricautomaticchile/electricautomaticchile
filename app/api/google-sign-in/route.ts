import { NextRequest, NextResponse } from "next/server"
import crypto from 'crypto'

const {
  COGNITO_DOMAIN,
  COGNITO_APP_CLIENT_ID
} = process.env

export async function GET(request: NextRequest) {
    let authorizeParams = new URLSearchParams()
    const origin = request.nextUrl.origin

    const state = crypto.randomBytes(16).toString('hex')

    authorizeParams.append('response_type', 'code')
    authorizeParams.append('client_id', COGNITO_APP_CLIENT_ID as string)
    authorizeParams.append('redirect_uri', `${origin}/api/callback`)
    authorizeParams.append('state', state)
    authorizeParams.append('identity_provider', 'Google')
    authorizeParams.append('scope', 'profile email openid')

    return NextResponse.redirect(`${COGNITO_DOMAIN}/oauth2/authorize?${authorizeParams.toString()}`)
}
