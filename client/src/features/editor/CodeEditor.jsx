import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { FileText } from "lucide-react";
import {
  fileContentSynced,
  replacementApplied,
  selectActiveFile,
  selectActiveLanguage,
} from "../files/filesSlice";
import useCollabEditor from "../../hooks/useCollabEditor";
import "../../lib/monacoSetup"; // bundled Monaco (loaded with the room page, not on every page)

// Two themes that match the Tailwind colours used in the rest of the app
function defineThemes(monaco) {
  monaco.editor.defineTheme("codecollab-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6b7280", fontStyle: "italic" },
      { token: "keyword", foreground: "c084fc" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fdba74" },
      { token: "type", foreground: "7dd3fc" },
    ],
    colors: {
      "editor.background": "#030712",
      "editor.lineHighlightBackground": "#111827",
      "editorLineNumber.foreground": "#4b5563",
      "editorLineNumber.activeForeground": "#e5e7eb",
      "editor.selectionBackground": "#4f46e555",
      "editorCursor.foreground": "#818cf8",
    },
  });
  monaco.editor.defineTheme("codecollab-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6b7280", fontStyle: "italic" },
      { token: "keyword", foreground: "7c3aed" },
      { token: "string", foreground: "15803d" },
      { token: "number", foreground: "c2410c" },
      { token: "type", foreground: "0369a1" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.lineHighlightBackground": "#f3f4f6",
      "editorLineNumber.foreground": "#9ca3af",
      "editorLineNumber.activeForeground": "#111827",
      "editor.selectionBackground": "#6366f133",
      "editorCursor.foreground": "#4f46e5",
    },
  });
}

function CodeEditor() {
  const file = useSelector(selectActiveFile);
  const language = useSelector(selectActiveLanguage);
  const { theme, fontSize } = useSelector((state) => state.editorSettings);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [editor, setEditor] = useState(null); // the Monaco instance, set once it has loaded
  const replaced = useSelector((state) => state.files.replaced);

  useCollabEditor(editor, file?.id, user); // live typing and cursors for the open file

  // The editor's text belongs to the live document, so Redux doesn't push text into it.
  // The one exception: the language dropdown swapping untouched starter code.
  useEffect(() => {
    const model = editor?.getModel();
    if (!replaced || !model || replaced.id !== file?.id) return;
    if (model.getValue() !== replaced.content) {
      const fullRange = model.getFullModelRange();
      model.pushEditOperations(
        [],
        [{ range: fullRange, text: replaced.content }],
        () => null,
      );
    }
    dispatch(replacementApplied());
  }, [replaced, editor, file?.id, dispatch]);

  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-gray-950 text-sm text-gray-500">
        <FileText size={28} className="text-gray-700" />
        Open a file from the explorer
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      theme={theme === "light" ? "codecollab-light" : "codecollab-dark"}
      beforeMount={defineThemes}
      path={file.id} // a separate model per file keeps each file's undo history
      language={language}
      defaultValue={file.content} // only for the first moment; then the live document takes over
      onMount={setEditor}
      onChange={(value) =>
        dispatch(fileContentSynced({ id: file.id, content: value ?? "" }))
      }
      loading={<div className="h-full w-full bg-gray-950" />}
      options={{
        fontSize,
        fontFamily: "'JetBrains Mono', Consolas, monospace",
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        renderLineHighlight: "all",
      }}
    />
  );
}

export default CodeEditor;
