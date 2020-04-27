export * from './music'
export * from './bili'
import { musicRouter } from './music'
import { biliRouter } from './bili'
import { Router } from 'express'

export const router = Router()

router.use(musicRouter)
router.use(biliRouter)
