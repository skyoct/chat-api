import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: '.env.local' })
dotenv.config()

export class ServerConfig {

    static get NODE_ENV() {
        return process.env.NODE_ENV || 'development'
    }

    static get OPENAI_API_KEY() {
        return process.env.OPENAI_API_KEY
    }

    static get OPENAI_PROXY_URL() {
        return process.env.OPENAI_PROXY_URL
    }

    static get JWT_SECRET() {
        console.log('JWT_SECRET', process.env.JWT_SECRET)
        return process.env.JWT_SECRET || 'adminslat456'
    }

    static get SMS_URL() {
        return process.env.SMS_URL
    }

}