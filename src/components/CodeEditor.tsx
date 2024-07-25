import MonacoEditor, { EditorProps, OnMount } from '@monaco-editor/react'
import { createATA } from './ata';

export interface EditorFile {
  name: string
  value: string
  language: string
}

interface CodeEditorProps {
  file: EditorFile
  onChange?: EditorProps['onChange'],
  options?: EditorProps["options"]
}

function CodeEditor(props: CodeEditorProps) {
  const { file, onChange, options } = props;
  const handleEditorMount: OnMount = (editor, monaco) => {

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
        editor.getAction('editor.action.formatDocument')?.run()

    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.Preserve,
        esModuleInterop: true,
    })

    const ata = createATA((code, path) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
    })

    editor.onDidChangeModelContent(() => {
        ata(editor.getValue());
    });

    ata(editor.getValue());
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MonacoEditor
        height={'100%'}
        path={file.name}
        language={file.language}
        onMount={handleEditorMount}
        onChange={onChange}
        value={file.value}
        options={
            {
                fontSize: 14,
                scrollBeyondLastLine: false,
                minimap: {
                  enabled: false,
                },
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
                ...options
            }
        }
      />
    </div>
  )
}

export default CodeEditor