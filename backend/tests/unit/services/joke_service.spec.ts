import { test } from '@japa/runner'
import axios from 'axios'
import JokeService from '#services/joke_service'

test.group('Joke Service', () => {
  test('should fetch a joke from geek-jokes API', async ({ assert }) => {
    const originalGet = axios.get

    axios.get = async () => {
      return {
        data: {
          joke: 'A funny mocked joke',
        },
      } as any
    }

    try {
      const joke = await JokeService.getJoke()

      assert.isString(joke)
      assert.isTrue(joke.length > 0)
    } finally {
      axios.get = originalGet
    }
  })

  test('should retry on failure', async ({ assert }) => {
    // This test validates that the service has retry logic
    // We mock axios to fail a few times before succeeding and
    // also stub the internal sleep to avoid slowing down the test.

    const originalGet = axios.get
    const originalMaxRetries = (JokeService as any).MAX_RETRIES
    const originalSleep = (JokeService as any).sleep

    let callCount = 0

    ;(JokeService as any).MAX_RETRIES = 3
    ;(JokeService as any).sleep = () => Promise.resolve()

    axios.get = async () => {
      callCount += 1

      if (callCount < 3) {
        throw new Error('Simulated network error')
      }

      return {
        data: {
          joke: 'This joke was fetched after retries',
        },
      } as any
    }

    try {
      const joke = await JokeService.getJoke()

      assert.isString(joke)
      assert.isTrue(joke.length > 0)
      assert.equal(callCount, 3)
    } finally {
      axios.get = originalGet
      ;(JokeService as any).MAX_RETRIES = originalMaxRetries
      ;(JokeService as any).sleep = originalSleep
    }
  })

  test('should return a non-empty string', async ({ assert }) => {
    const originalGet = axios.get

    axios.get = async () => {
      return {
        data: {
          joke: 'Another mocked but meaningful joke',
        },
      } as any
    }

    try {
      const joke = await JokeService.getJoke()

      assert.isString(joke)
      assert.isTrue(joke.length > 10, 'Joke should be meaningful')
    } finally {
      axios.get = originalGet
    }
  })
})
