// The "Hello, team!" file every new room starts with (same as client/src/utils/starterFiles.js)
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