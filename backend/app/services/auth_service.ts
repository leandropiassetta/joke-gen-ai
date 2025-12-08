import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import JwtService from '#services/jwt_service'

export default class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findBy('email', email)
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const valid = await hash.verify(user.password, password)
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const token = JwtService.generate(user)

    return {
      token,
      user,
    }
  }
}
