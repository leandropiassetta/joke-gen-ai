import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    authUser?: {
      id: number
      email: string
    }
  }
}