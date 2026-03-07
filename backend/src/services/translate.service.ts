import axios from 'axios'

interface TranslationResult {
  translatedText: string
  detectedSourceLanguage?: string
}

interface LibreTranslateResponse {
  translatedText: string
  detectedLanguage?: {
    confidence: number
    language: string
  }
}

const languageMap: Record<string, string> = {
  'en': 'en',
  'hi': 'hi',
}

export class TranslateService {
  private static apiUrl = process.env.LIBRE_TRANSLATE_API_URL || 'https://api.libretranslate.de'
  private static apiKey = process.env.LIBRE_TRANSLATE_API_KEY || ''

  /**
   * Translate a single text from a source language to target language
   */
  static async translateText(
    text: string,
    targetLanguage: 'en' | 'hi',
    sourceLanguage: string = 'en'
  ): Promise<TranslationResult> {
    try {
      const mappedTarget = languageMap[targetLanguage] || targetLanguage
      const mappedSource = languageMap[sourceLanguage] || sourceLanguage

      const response = await axios.post<LibreTranslateResponse>(
        `${this.apiUrl}/translate`,
        {
          q: text,
          source: mappedSource,
          target: mappedTarget,
          api_key: this.apiKey,
        }
      )

      return {
        translatedText: response.data.translatedText,
        detectedSourceLanguage: response.data.detectedLanguage?.language,
      }
    } catch (error) {
      console.error('Translation error:', error)
      // Return original text if translation fails
      return {
        translatedText: text,
      }
    }
  }

  /**
   * Translate multiple texts in batch
   */
  static async translateBatch(
    texts: string[],
    targetLanguage: 'en' | 'hi',
    sourceLanguage: string = 'en'
  ): Promise<string[]> {
    try {
      const mappedTarget = languageMap[targetLanguage] || targetLanguage
      const mappedSource = languageMap[sourceLanguage] || sourceLanguage

      const translations = await Promise.all(
        texts.map(text =>
          axios.post<LibreTranslateResponse>(
            `${this.apiUrl}/translate`,
            {
              q: text,
              source: mappedSource,
              target: mappedTarget,
              api_key: this.apiKey,
            }
          ).then(res => res.data.translatedText)
        )
      )

      return translations
    } catch (error) {
      console.error('Batch translation error:', error)
      // Return original texts if translation fails
      return texts
    }
  }

  /**
   * Translate a nested object (for translating entire UI strings)
   */
  static async translateObject(
    obj: Record<string, any>,
    targetLanguage: 'en' | 'hi',
    sourceLanguage: string = 'en'
  ): Promise<Record<string, any>> {
    const translateRecursive = async (value: any): Promise<any> => {
      if (typeof value === 'string') {
        const result = await this.translateText(value, targetLanguage, sourceLanguage)
        return result.translatedText
      }
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const translatedObj: Record<string, any> = {}
        for (const key in value) {
          translatedObj[key] = await translateRecursive(value[key])
        }
        return translatedObj
      }
      if (Array.isArray(value)) {
        return Promise.all(value.map(item => translateRecursive(item)))
      }
      return value
    }

    return translateRecursive(obj)
  }
}
