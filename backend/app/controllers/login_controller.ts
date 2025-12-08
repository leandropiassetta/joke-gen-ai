import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { LoginValidator } from '#validators/login_validator'
import User from '#models/user'

export default class LoginController {
  async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(LoginValidator)

      const result = await AuthService.login(payload.email, payload.password)

      return response.ok({
        token: result.token,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      })
    } catch (error: any) {

      if (error.messages) {
        return response.badRequest({
          error: error.messages,
        })
      }

      if (error.message === 'INVALID_CREDENTIALS') {
        return response.badRequest({
          error: 'INVALID_CREDENTIALS',
        })
      }

      return response.internalServerError({
        error: 'UNEXPECTED_ERROR',
      })
    }
  }

  async me(ctx: HttpContext) {
    try {
      // AuthMiddleware já validou o token e colocou o payload em ctx.authUser
      const payload = (ctx as any).authUser

      if (!payload || !payload.id) {
        return ctx.response.unauthorized({ error: 'INVALID_TOKEN_PAYLOAD' })
      }

      const user = await User.find(payload.id)

      if (!user) {
        return ctx.response.unauthorized({ error: 'USER_NOT_FOUND' })
      }

      return ctx.response.ok({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (error) {
      return ctx.response.unauthorized({ error: 'INVALID_OR_EXPIRED_TOKEN' })
    }
  }
}
