/**
 * PDF生成時に適用するスタイル
 */
export const getPdfStyles = () => {
  return {
    // 印刷用スタイル
    '@page': {
      margin: '10mm',
      size: 'A4',
    },
    'html, body': {
      margin: 0,
      padding: 0,
      fontFamily: 'sans-serif',
      fontSize: '10pt',
      lineHeight: 1.5,
      color: '#333',
      backgroundColor: '#fff',
    },
    '.mdx-content': {
      padding: '10mm',
    },
    'h1, h2, h3, h4, h5, h6': {
      margin: '1em 0 0.5em 0',
      pageBreakAfter: 'avoid',
      pageBreakInside: 'avoid',
    },
    h1: {
      fontSize: '18pt',
      borderBottom: '1px solid #ccc',
      paddingBottom: '0.2em',
    },
    h2: {
      fontSize: '16pt',
      borderBottom: '1px solid #eee',
      paddingBottom: '0.1em',
    },
    h3: {
      fontSize: '14pt',
    },
    'p, ul, ol, pre, table': {
      margin: '0.5em 0',
      pageBreakInside: 'avoid',
    },
    'ul, ol': {
      paddingLeft: '2em',
    },
    li: {
      margin: '0.25em 0',
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
    },
    'pre, code': {
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '3px',
      padding: '0.2em 0.4em',
      fontSize: '0.9em',
      overflow: 'auto',
      maxWidth: '100%',
      whiteSpace: 'pre-wrap',
    },
    'pre code': {
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0,
    },
    blockquote: {
      margin: '1em 0',
      padding: '0 1em',
      borderLeft: '4px solid #ddd',
      color: '#666',
    },
    table: {
      borderCollapse: 'collapse',
      width: '100%',
    },
    'th, td': {
      border: '1px solid #ddd',
      padding: '0.5em',
      textAlign: 'left',
    },
    th: {
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
    },
    // ページブレーク関連
    '.page-break': {
      pageBreakAfter: 'always',
    },
    '.no-break': {
      pageBreakInside: 'avoid',
    },
  };
};
