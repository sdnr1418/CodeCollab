import { body, param } from 'express-validator'

// Letters, numbers, dot, dash, underscore and spaces; no slashes, so no folders or "../"
const FILE_NAME = /^[\w.\- ]+$/

const fileName = (field = 'name') =>
  body(field)
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('File name must be 1 to 100 characters')
    .matches(FILE_NAME)
    .withMessage('File names can only use letters, numbers, spaces, . - and _')

const content = (field = 'content') =>
  body(field).optional().isString().isLength({ max: 500_000 }).withMessage('File is too large')

export const fileIdRules = [param('fileId').isMongoId().withMessage('File not found')]

export const createFileRules = [fileName(), content()]

// PATCH one file: rename, save its content, or both (the language dropdown sends both)
export const updateFileRules = [
  ...fileIdRules,
  fileName().optional(),
  content(),
  body().custom((b) => b.name !== undefined || b.content !== undefined).withMessage('Nothing to update'),
]

// PATCH all: { changes: [{ id, content }] } from the Save button
export const saveFilesRules = [
  body('changes').isArray({ min: 1, max: 50 }).withMessage('changes must be a list of files'),
  body('changes.*.id').isMongoId().withMessage('Invalid file id'),
  content('changes.*.content'),
]

export const messageRules = [
  body('text').isString().trim().isLength({ min: 1, max: 2000 }).withMessage('Messages must be 1 to 2000 characters'),
]