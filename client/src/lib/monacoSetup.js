// Loads the Monaco editor from our own bundle instead of a CDN.
// y-monaco (live editing) must use the same copy of Monaco as the editor,
// and a bundled editor also works offline later (PWA, Step 24).
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/language/typescript/ts.worker?worker'

// Monaco does heavy work (like JavaScript checking) in background Web Workers
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'typescript' || label === 'javascript') return new TsWorker()
    return new EditorWorker()
  },
}

loader.config({ monaco })