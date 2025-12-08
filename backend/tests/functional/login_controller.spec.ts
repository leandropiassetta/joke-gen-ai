import { test } from '@japa/runner'

test.group('Login Controller', () => {
  test('POST /login - should authenticate user with valid credentials', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'cliente@incuca.com.br',
      password: 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.',
    })

    response.assertStatus(200)
    assert.properties(response.body(), ['token', 'user'])
    assert.properties(response.body().user, ['id', 'email', 'name'])
    assert.equal(response.body().user.email, 'cliente@incuca.com.br')
  })

  test('POST /login - should reject invalid email', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'not-an-email',
      password: 'password123',
    })

    response.assertStatus(400)
  })

  test('POST /login - should reject short password', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'test@example.com',
      password: 'short',
    })

    response.assertStatus(400)
  })

  test('POST /login - should reject non-existent user', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    response.assertStatus(400)
    assert.property(response.body(), 'error')
  })

  test('POST /login - should reject wrong password', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'cliente@incuca.com.br',
      password: 'wrongpassword',
    })

    response.assertStatus(400)
    assert.equal(response.body().error, 'INVALID_CREDENTIALS')
  })

  test('GET /me - should return authenticated user data', async ({ client, assert }) => {
    const loginResponse = await client.post('/login').json({
      email: 'cliente@incuca.com.br',
      password: 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.',
    })

    const token = loginResponse.body().token

    const meResponse = await client.get('/me').header('Authorization', `Bearer ${token}`)

    meResponse.assertStatus(200)
    assert.properties(meResponse.body(), ['user'])
    assert.equal(meResponse.body().user.email, 'cliente@incuca.com.br')
  })

  test('GET /me - should reject unauthorized access', async ({ client }) => {
    const response = await client.get('/me')

    response.assertStatus(401)
  })

  test('GET /me - should reject invalid token', async ({ client }) => {
    const response = await client.get('/me').header('Authorization', 'Bearer invalid-token')

    response.assertStatus(401)
  })
})
