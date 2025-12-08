import type { HttpContext } from '@adonisjs/core/http'
import JokeService from '#services/joke_service'

export default class JokesController {
  async index({ response }: HttpContext) {
    try {
      const joke = await JokeService.getJoke()

      return response.ok({
        joke,
      })
    } catch (error) {
      return response.internalServerError({
        error: 'FAILED_TO_FETCH_JOKE',
      })
    }
  }
}
