import axios from 'axios'

export default class JokeService {
  private static readonly MAX_RETRIES = 3
  private static readonly TIMEOUT_MS = 5000
  private static readonly RETRY_DELAY_MS = 1000
  private static readonly API_URL = 'https://geek-jokes.sameerkumar.website/api?format=json'

  static async getJoke(): Promise<string> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(this.API_URL, {
          timeout: this.TIMEOUT_MS,
        })

        if (!response.data || !response.data.joke) {
          throw new Error('Invalid response format from joke API')
        }

        return response.data.joke
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        console.warn(`Joke API attempt ${attempt}/${this.MAX_RETRIES} failed:`, lastError.message)

        // Don't retry on the last attempt
        if (attempt < this.MAX_RETRIES) {
          const delayMs = this.RETRY_DELAY_MS * attempt // Exponential backoff
          await this.sleep(delayMs)
        }
      }
    }

    console.error('All joke API retries exhausted:', lastError?.message)
    throw new Error('FAILED_TO_FETCH_JOKE')
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
