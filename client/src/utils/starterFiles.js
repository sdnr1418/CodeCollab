import { LANGUAGES, languageFromFileName } from './languages'

// The "Hello, team!" file each language starts with. Used when a room is created,
// and when the language dropdown switches a file that is still untouched.
export const STARTER_FILES = {
  cpp: {
    name: 'main.cpp',
    content:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, team!" << endl;\n  return 0;\n}\n',
  },
  java: {
    name: 'Main.java',
    content:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, team!");\n  }\n}\n',
  },
  python: { name: 'main.py', content: 'print("Hello, team!")\n' },
  javascript: { name: 'index.js', content: "console.log('Hello, team!')\n" },
}

const isUntouchedStarter = (content) =>
  Object.values(STARTER_FILES).some((s) => s.content.trim() === content.trim())

// Works out what a file should become when its language is switched to `language`.
// Returns { name, content } (content only if it should be replaced),
// or null when the file isn't a code file (e.g. README.md), so only the colours change.
export function planLanguageChange(file, language) {
  const isCodeFile = LANGUAGES.some((l) => l.value === languageFromFileName(file.name))
  const target = LANGUAGES.find((l) => l.value === language)
  if (!isCodeFile || !target) return null

  // Untouched starter code: swap it for the new language's starter
  if (isUntouchedStarter(file.content)) return { ...STARTER_FILES[language] }

  // Real code: keep it, and just change the extension (main.cpp -> main.py)
  const base = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name
  return { name: base + target.extensions[0] }
}