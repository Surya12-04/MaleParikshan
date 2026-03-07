import { Router } from 'express'
import { TranslateController } from '../controllers/translate.controller'

const router = Router()

/**
 * Translation endpoints
 */
router.post('/translate', TranslateController.translate)
router.post('/translate/batch', TranslateController.translateBatch)
router.post('/translate/object', TranslateController.translateObject)

export default router
