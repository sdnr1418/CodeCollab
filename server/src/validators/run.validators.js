import { body } from 'express-validator'
import { RUNNERS } from '../services/judge0.service.js'

export const runRules = [
  body('language')
    .isIn(Object.keys(RUNNERS))
    .withMessage('Only C++, Java, Python and JavaScript files can be run'),
  body('fileName').isString().trim().isLength({ min: 1, max: 100 }).withMessage('File name is missing'),
  body('code')
    .isString()
    .isLength({ min: 1, max: 100_000 })
    .withMessage('The file is empty or too large to run'),
]