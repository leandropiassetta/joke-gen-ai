import { test } from '@japa/runner'
import JwtService from '#services/jwt_service'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

test.group('JWT Service', (group) => {
  group.each.setup(async () => {
    await db.rawQuery('BEGIN')
  })

  group.each.teardown(async () => {
    await db.rawQuery('ROLLBACK')
  })

  test('should create a valid JWT token', async ({ assert }) => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = JwtService.generate(user)

    assert.isString(token)
    assert.match(token, /^eyJ/)
  })

  test('should verify a valid token', async ({ assert }) => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = JwtService.generate(user)
    const decoded = JwtService.verify(token)

    assert.equal(decoded.id, user.id)
    assert.equal(decoded.email, user.email)
  })

  test('should reject an invalid token', ({ assert }) => {
    const invalidToken = 'invalid.token.here'

    try {
      JwtService.verify(invalidToken)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.isDefined(error)
    }
  })

  test('should include expiration in token', async ({ assert }) => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = JwtService.generate(user)
    const decoded = JwtService.verify(token) as any

    assert.isDefined(decoded.exp)
    assert.isNumber(decoded.exp)
  })
})

