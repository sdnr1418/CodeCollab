import { mockDelay } from '../utils/mockDelay'

// Phase 1: fake output. Phase 2: POST to the backend, which calls Judge0.
export async function runCode(language, code) {
  const lines = code.split('\n').length
  return mockDelay({ stdout: `[mock] Ran ${lines} lines of ${language}.\nHello from CodeCollab!`, stderr: '' }, 600)
}