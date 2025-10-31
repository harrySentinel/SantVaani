import React, { useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './RichTextEditor.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your blog content here...',
  className = ''
}) => {
  // Configure toolbar with all the formatting options
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // H1, H2, H3, Normal text
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
      ['blockquote', 'code-block'], // Blockquote and code
      [{ 'color': [] }, { 'background': [] }], // Text color and highlight
      [{ 'align': [] }], // Text alignment
      ['link', 'image'], // Links and images
      ['clean'] // Remove formatting
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'color', 'background',
    'align',
    'link', 'image'
  ]

  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight: '400px' }}
      />
      <div className="mt-2 text-xs text-gray-500">
        💡 <strong>Tip:</strong> Use the toolbar to add headings (H1, H2, H3), bold text, lists, quotes, and more.
        Works perfectly with Hindi (हिंदी) and English!
      </div>
    </div>
  )
}

export default RichTextEditor
