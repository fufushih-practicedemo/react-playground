import { useState } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css"; // 确保导入 Allotment 的样式
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";

export default function Playground() {
  const [code, setCode] = useState(`
import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1>React Playground</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
  `.trim());

  const file = {
    name: 'App.tsx',
    value: code,
    language: 'typescript'
  };

  function onEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }


  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      <Allotment>
        <Allotment.Pane minSize={300} preferredSize="50%">
          <CodeEditor file={file} onChange={onEditorChange} />
        </Allotment.Pane>
        <Allotment.Pane minSize={300} preferredSize="50%">
          <Preview code={code} />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}