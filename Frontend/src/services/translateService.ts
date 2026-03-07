import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

interface TranslateResponse {
  translatedText: string
}

interface TranslateBatchResponse {
  translations: string[]
}

export const translateService = {
  // Translate a single text
  async translate(text: string, targetLanguage: 'en' | 'hi'): Promise<string> {
    try {
      const response = await api.post<TranslateResponse>('/translate', {
        text,
        targetLanguage
      })
      return response.data.translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original text on error
    }
  },

  // Translate multiple texts in batch
  async translateBatch(texts: string[], targetLanguage: 'en' | 'hi'): Promise<string[]> {
    try {
      const response = await api.post<TranslateBatchResponse>('/translate/batch', {
        texts,
        targetLanguage
      })
      return response.data.translations
    } catch (error) {
      console.error('Batch translation error:', error)
      return texts // Return original texts on error
    }
  }
}
