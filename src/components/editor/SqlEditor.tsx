'use client'

import { useEffect, useRef } from 'react'
import { EditorState, Compartment } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, drawSelection } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { sql, SQLite } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Create a state compartment to dynamically control read-only status safely
const readOnlyCompartment = new Compartment()

const customTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    backgroundColor: 'transparent',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace",
    lineHeight: '1.7',
    padding: '16px 0',
    overflow: 'auto',
  },
  '.cm-content': {
    padding: '0 16px',
    caretColor: '#7F77DD',
  },
  '.cm-focused': {
    outline: 'none',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    borderRight: '1px solid #262626',
    color: '#404040',
    paddingRight: '8px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    paddingLeft: '8px',
    minWidth: '32px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(127, 119, 221, 0.06)',
  },
})

export function SqlEditor({ value, onChange, disabled = false }: SqlEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!containerRef.current) return

    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        drawSelection(),
        bracketMatching(),
        closeBrackets(),
        lineNumbers(),
        sql({ dialect: SQLite }),
        autocompletion(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        oneDark,
        customTheme,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        EditorView.lineWrapping,
        // Initialize the dynamic compartment
        readOnlyCompartment.of(EditorState.readOnly.of(disabled)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [])

  // Sync value changes from parent components cleanly
  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    const currentDoc = view.state.doc.toString()
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value }
      })
    }
  }, [value])

  // Fire a safe dynamic update to toggle read-only mode instantly
  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    view.dispatch({
      effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(disabled))
    })
  }, [disabled])

  return <div ref={containerRef} className="h-full w-full" aria-label="SQL editor" />
}