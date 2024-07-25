import React, { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';

interface PreviewProps {
  code: string;
}

const createHtml = (code: string) => {
  // 使用 Babel 轉譯代碼，但不轉換模塊格式
  const transformedCode = Babel.transform(code, {
    presets: ['react'],
  }).code;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Playground</title>
  <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
      }
    }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react';
    import { createRoot } from 'react-dom/client';

    const code = \`
      ${transformedCode}
    \`;
    
    const module = await import(\`data:text/javascript;charset=utf-8,\${encodeURIComponent(code)}\`);
    const App = module.default;
    
    createRoot(document.getElementById('root')).render(React.createElement(App));
  </script>
</body>
</html>
`;
};

export default function Preview({ code }: PreviewProps) {
  const [iframeUrl, setIframeUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const html = createHtml(code);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setIframeUrl(url);
      setError(null);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [code]);

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <iframe
      src={iframeUrl}
      style={{
        width: '100%',
        height: '100%',
        border: 'none'
      }}
    />
  );
}