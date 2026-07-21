import { BaseSchema } from '@adonisjs/lucid/schema'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class extends BaseSchema {
  public async up() {
    const passwordHash = await hash.make(
      'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.'
    )

    await User.create({
      name: 'Cliente Incuca',
      email: 'cliente@incuca.com.br',
      password: passwordHash,
    })
  }

  public async down() {
    await User.query().where('email', 'cliente@incuca.com.br').delete()
  }
}
