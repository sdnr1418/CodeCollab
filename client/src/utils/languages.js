// value = Monaco language id
export const LANGUAGES = [
  { value: 'cpp', label: 'C++', extension: '.cpp' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
]

export const languageFromFileName = (name) =>
  LANGUAGES.find((l) => name.endsWith(l.extension))?.value ?? 'plaintext'