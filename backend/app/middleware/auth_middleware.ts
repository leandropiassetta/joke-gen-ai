import type { HttpContext } from '@adonisjs/core/http'
import JwtService from '#services/jwt_service'

export default function AuthMiddleware() {
  return async function (ctx: HttpContext, next: () => Promise<void>) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ error: 'MISSING_OR_INVALID_TOKEN' })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      const payload = JwtService.verify(token)

      ctx.authUser = payload

      await next()
    } catch (err) {
      return ctx.response.unauthorized({ error: 'INVALID_OR_EXPIRED_TOKEN' })
    }
  }
}
