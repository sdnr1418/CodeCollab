// value = Monaco language id
export const LANGUAGES = [
  { value: 'cpp', label: 'C++', extensions: ['.cpp', '.hpp', '.h', '.cc'] },
  { value: 'java', label: 'Java', extensions: ['.java'] },
  { value: 'python', label: 'Python', extensions: ['.py'] },
  { value: 'javascript', label: 'JavaScript', extensions: ['.js', '.jsx'] },
]

export const languageLabel = (value) => LANGUAGES.find((l) => l.value === value)?.label ?? value

export const languageFromFileName = (name) => {
  if (name.endsWith('.md')) return 'markdown'
  return LANGUAGES.find((l) => l.extensions.some((ext) => name.endsWith(ext)))?.value ?? 'plaintext'
}