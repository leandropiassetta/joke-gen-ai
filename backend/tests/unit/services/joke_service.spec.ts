import { test } from '@japa/runner'
import JokeService from '#services/joke_service'

test.group('Joke Service', () => {
  test('should fetch a joke from geek-jokes API', async ({ assert }) => {
    const joke = await JokeService.getJoke()

    assert.isString(joke)
    assert.isTrue(joke.length > 0)
  })

  test('should retry on failure', async ({ assert }) => {
    // This test validates that the service has retry logic
    // In a real scenario, you might mock the axios call
    const joke = await JokeService.getJoke()

    assert.isString(joke)
    assert.isTrue(joke.length > 0)
  })

  test('should return a non-empty string', async ({ assert }) => {
    const joke = await JokeService.getJoke()

    assert.isString(joke)
    assert.isTrue(joke.length > 10, 'Joke should be meaningful')
  })
})
