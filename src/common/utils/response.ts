export class ResponseUtil<T = any> {

    public code?: number

    public message?: string

    public data?: any

    constructor(code: number, message: string, data?: T) {
        this.code = code
        this.message = message
        this.data = data
    }

    static ok<T>(data?: T) {
        return { code: 200, message: 'success', data }
    }

    static serverError<T>(message: string) {
        return { code: 500, message: message }
    }

    static requestError<T>(message: string) {
        return { code: 400, message: message}
    }

    static unauthorized<T>(message: string) {
        return { code: 401, message: message }
    }


}