import { test } from '@japa/runner'
import User from '#models/user'
import AuthService from '#services/auth_service'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

test.group('Auth Service', (group) => {
  group.each.setup(async () => {
    await db.rawQuery('BEGIN')
  })

  group.each.teardown(async () => {
    await db.rawQuery('ROLLBACK')
  })

  test('should validate user with correct credentials', async ({ assert }) => {
    // Create a test user with hashed password
    const hashedPassword = await hash.make('password123')
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    })

    const result = await AuthService.login(user.email, 'password123')

    assert.equal(result.user.id, user.id)
    assert.equal(result.user.email, user.email)
    assert.isDefined(result.token)
  })

  test('should reject user with incorrect password', async ({ assert }) => {
    const hashedPassword = await hash.make('password123')
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    })

    try {
      await AuthService.login('test@example.com', 'wrongpassword')
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.equal(error.message, 'INVALID_CREDENTIALS')
    }
  })

  test('should reject non-existent user', async ({ assert }) => {
    try {
      await AuthService.login('nonexistent@example.com', 'password123')
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.equal(error.message, 'INVALID_CREDENTIALS')
    }
  })
})
