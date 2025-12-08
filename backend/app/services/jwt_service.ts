import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'

export interface JwtPayload {
  id: number
  email: string
}

export default class JwtService {
  static generate(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    }

    return jwt.sign(payload, env.get('APP_KEY'), {
      expiresIn: '1h',
    })
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, env.get('APP_KEY')) as JwtPayload
  }
}
