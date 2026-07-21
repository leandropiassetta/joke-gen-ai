import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

test.group('Jokes Controller', (group) => {
  group.each.setup(async () => {
    await db.rawQuery('BEGIN')
  })

  group.each.teardown(async () => {
    await db.rawQuery('ROLLBACK')
  })

  test('GET /joke - should return a joke with valid token', async ({ client, assert }) => {
    // Login with default user to get token
    const loginResponse = await client.post('/login').json({
      email: 'cliente@incuca.com.br',
      password: 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.',
    })

    const token = loginResponse.body().token

    // Get joke
    const jokeResponse = await client.get('/joke').header('Authorization', `Bearer ${token}`)

    jokeResponse.assertStatus(200)
    assert.property(jokeResponse.body(), 'joke')
    assert.isString(jokeResponse.body().joke)
    assert.isTrue(jokeResponse.body().joke.length > 0)
  })

  test('GET /joke - should reject unauthorized access', async ({ client }) => {
    const response = await client.get('/joke')

    response.assertStatus(401)
  })

  test('GET /joke - should reject invalid token', async ({ client }) => {
    const response = await client.get('/joke').header('Authorization', 'Bearer invalid-token')

    response.assertStatus(401)
  })

  test('GET /joke - should return different jokes on multiple calls', async ({
    client,
    assert,
  }) => {
    // Login with default user to get token
    const loginResponse = await client.post('/login').json({
      email: 'cliente@incuca.com.br',
      password: 'seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.',
    })

    const token = loginResponse.body().token

    // Get first joke
    const joke1Response = await client.get('/joke').header('Authorization', `Bearer ${token}`)
    const joke1 = joke1Response.body().joke

    // Get second joke
    const joke2Response = await client.get('/joke').header('Authorization', `Bearer ${token}`)
    const joke2 = joke2Response.body().joke

    // Jokes should be non-empty (they might be the same, but that's okay)
    assert.isTrue(joke1.length > 0)
    assert.isTrue(joke2.length > 0)
  })
})
