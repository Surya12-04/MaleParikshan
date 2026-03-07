import { Request, Response } from 'express'
import { TranslateService } from '../services/translate.service'

export class TranslateController {
  /**
   * POST /translate
   * Translate a single text
   */
  static async translate(req: Request, res: Response): Promise<void> {
    try {
      const { text, targetLanguage, sourceLanguage = 'en' } = req.body

      // Validate input
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text is required and must be a string' })
        return
      }

      if (!['en', 'hi'].includes(targetLanguage)) {
        res.status(400).json({ error: 'Target language must be "en" or "hi"' })
        return
      }

      const result = await TranslateService.translateText(text, targetLanguage, sourceLanguage)
      res.json(result)
    } catch (error) {
      console.error('Translation error:', error)
      res.status(500).json({ error: 'Translation failed' })
    }
  }

  /**
   * POST /translate/batch
   * Translate multiple texts
   */
  static async translateBatch(req: Request, res: Response): Promise<void> {
    try {
      const { texts, targetLanguage, sourceLanguage = 'en' } = req.body

      // Validate input
      if (!Array.isArray(texts)) {
        res.status(400).json({ error: 'Texts must be an array' })
        return
      }

      if (!['en', 'hi'].includes(targetLanguage)) {
        res.status(400).json({ error: 'Target language must be "en" or "hi"' })
        return
      }

      const translations = await TranslateService.translateBatch(texts, targetLanguage, sourceLanguage)
      res.json({ translations })
    } catch (error) {
      console.error('Batch translation error:', error)
      res.status(500).json({ error: 'Batch translation failed' })
    }
  }

  /**
   * POST /translate/object
   * Translate all strings in a nested object
   */
  static async translateObject(req: Request, res: Response): Promise<void> {
    try {
      const { obj, targetLanguage, sourceLanguage = 'en' } = req.body

      // Validate input
      if (typeof obj !== 'object' || obj === null) {
        res.status(400).json({ error: 'Object is required and must be an object' })
        return
      }

      if (!['en', 'hi'].includes(targetLanguage)) {
        res.status(400).json({ error: 'Target language must be "en" or "hi"' })
        return
      }

      const translatedObj = await TranslateService.translateObject(obj, targetLanguage, sourceLanguage)
      res.json({ translatedObj })
    } catch (error) {
      console.error('Object translation error:', error)
      res.status(500).json({ error: 'Object translation failed' })
    }
  }
}
