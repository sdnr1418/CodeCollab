import { mockDelay } from '../utils/mockDelay'

const COMMANDS = {
  cpp: (file) => `g++ -std=c++17 ${file} -o main && ./main < input.txt`,
  java: (file) => `javac ${file} && java Main`,
  python: (file) => `python3 ${file}`,
  javascript: (file) => `node ${file}`,
}

// Phase 1: fake output. Phase 3: POST to the backend, which calls Judge0.
export async function runCode(fileName, language, code) {
  const started = performance.now()
  const command = (COMMANDS[language] ?? COMMANDS.python)(fileName)
  const result = code.includes('#error')
    ? { exitCode: 1, stdout: '', stderr: `${fileName}:1:2: error: #error directive` }
    : {
        exitCode: 0,
        stdout: 'Shortest distances from node 0\n  0 → 1 : 3\n  0 → 2 : 1\n  0 → 3 : 4',
        stderr: '',
      }
  const output = await mockDelay({ command, ...result }, 700)
  return { ...output, timeMs: Math.round(performance.now() - started) }
}