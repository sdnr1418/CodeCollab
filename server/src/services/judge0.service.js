// Sends code to Judge0 (a code-running service) and waits for the result.
// Judge0 compiles and runs it in a sandbox on their servers, so student code never runs on ours.
// Docs: https://ce.judge0.com
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

// Judge0 CE language ids (GET <JUDGE0_URL>/languages lists them all).
// command = what we show in the Output panel, like a terminal would.
// options = extra compiler flags. Judge0's GCC 9.2 uses C++14 unless we ask for C++17.
export const RUNNERS = {
  cpp: { id: 54, options: '-std=c++17', command: (file) => `g++ -std=c++17 ${file} -o main && ./main` }, // GCC 9.2
  java: { id: 62, command: (file) => `javac ${file} && java Main` }, // OpenJDK 13
  python: { id: 71, command: (file) => `python3 ${file}` }, // Python 3.8
  javascript: { id: 63, command: (file) => `node ${file}` }, // Node.js 12
}

// Code and output travel as base64, so any character (emoji, Urdu text) survives the trip
const toBase64 = (text) => Buffer.from(text ?? '', 'utf8').toString('base64')
const fromBase64 = (text) => (text ? Buffer.from(text, 'base64').toString('utf8') : '')

const ACCEPTED = 3 // Judge0 status id for "ran and finished normally"

export async function runOnJudge0({ language, code, stdin }) {
  const headers = { 'Content-Type': 'application/json' }
  if (env.judge0Key) {
    // RapidAPI's Judge0 needs these two headers; the free public instance needs none
    headers['X-RapidAPI-Key'] = env.judge0Key
    headers['X-RapidAPI-Host'] = new URL(env.judge0Url).host
  }

  let response
  try {
    // wait=true: Judge0 answers when the program has finished, so one request is enough
    response = await fetch(`${env.judge0Url}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        language_id: RUNNERS[language].id,
        compiler_options: RUNNERS[language].options, // left out when undefined
        source_code: toBase64(code),
        stdin: toBase64(stdin),
      }),
      signal: AbortSignal.timeout(20_000), // give up after 20 seconds
    })
  } catch {
    throw new ApiError(502, 'The code runner is not responding. Try again in a moment.')
  }

  if (response.status === 429) {
    throw new ApiError(429, 'The code runner is busy or its daily limit is used up. Try again later.')
  }
  if (!response.ok) {
    console.error('Judge0 error:', response.status, await response.text().catch(() => ''))
    throw new ApiError(502, `The code runner failed (status ${response.status}).`)
  }

  const result = await response.json()
  const ok = result.status?.id === ACCEPTED
  // A compile error, a crash, or "Time Limit Exceeded": show whatever explains it
  const errors = [result.compile_output, result.stderr, result.message].map(fromBase64).filter(Boolean)
  if (!ok && errors.length === 0) errors.push(result.status?.description ?? 'Error')

  return {
    exitCode: ok ? 0 : (result.exit_code ?? 1),
    stdout: fromBase64(result.stdout),
    stderr: errors.join('\n'),
    timeMs: result.time ? Math.round(Number(result.time) * 1000) : null,
  }
}