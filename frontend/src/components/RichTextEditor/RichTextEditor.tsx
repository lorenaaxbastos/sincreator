import { forwardRef, useEffect, useId, useImperativeHandle } from 'react';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Highlighter, Link as LinkIcon, List, ListOrdered } from 'lucide-react';
import styles from './RichTextEditor.module.css';

export type RichTextControl =
  | 'bold'
  | 'italic'
  | 'highlight'
  | 'link'
  | 'bulletList'
  | 'orderedList';

export interface RichTextEditorRef {
  focus: () => void;
}

export interface RichTextEditorProps {
  id?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  allowedControls?: RichTextControl[];
  maxLength?: number;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

const ALL_CONTROLS: RichTextControl[] = [
  'bold',
  'italic',
  'highlight',
  'link',
  'bulletList',
  'orderedList',
];

const baseExtensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    link: false,
  }),
  Highlight,
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      class: styles.link,
    },
  }),
];

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      id,
      className = '',
      value,
      defaultValue,
      onChange,
      onBlur,
      allowedControls = ALL_CONTROLS,
      maxLength,
      placeholder,
      hasError = false,
      disabled = false,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const errorId = `${controlId}-error`;

    const editor = useEditor({
      extensions: [...baseExtensions, CharacterCount.configure({ limit: maxLength })],
      content: value ?? defaultValue ?? '',
      editable: !disabled,
      editorProps: {
        attributes: {
          id: controlId,
          role: 'textbox',
          'aria-label': ariaLabel ?? 'Editor de texto',
          'aria-invalid': hasError ? 'true' : 'false',
          'aria-errormessage': hasError ? errorId : '',
          class: styles.editorContent,
          ...(placeholder ? { 'data-placeholder': placeholder } : {}),
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        if (onChange) {
          const html = currentEditor.isEmpty ? '' : currentEditor.getHTML();
          onChange(html);
        }
      },
      onBlur: () => {
        if (onBlur) {
          onBlur();
        }
      },
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        editor.commands.focus();
      },
    }));

    useEffect(() => {
      if (value === undefined) return;
      const currentContent = editor.getHTML();
      if (value !== currentContent && !(editor.isEmpty && value === '')) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    useEffect(() => {
      if (editor.isEditable === disabled) {
        editor.setEditable(!disabled);
      }
    }, [disabled, editor]);

    const isAllowed = (control: RichTextControl) => allowedControls.includes(control);
    const currentChars = editor.storage.characterCount.characters();
    const isNearLimit = maxLength ? currentChars >= maxLength * 0.9 : false;

    const wrapperClasses = [
      styles.wrapper,
      hasError ? styles.error : '',
      disabled ? styles.disabled : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <div className={styles.toolbar} role="toolbar" aria-label="Ferramentas de formatação">
          {/* ... (Os botões continuam exatamente os mesmos do código anterior) ... */}
          {isAllowed('bold') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={disabled}
              className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.toolbarBtnActive : ''}`}
              aria-label="Negrito"
            >
              <Bold size={16} strokeWidth={2.5} />
            </button>
          )}

          {isAllowed('italic') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={disabled}
              className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.toolbarBtnActive : ''}`}
              aria-label="Itálico"
            >
              <Italic size={16} strokeWidth={2.5} />
            </button>
          )}

          {isAllowed('highlight') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              disabled={disabled}
              className={`${styles.toolbarBtn} ${editor.isActive('highlight') ? styles.toolbarBtnActive : ''}`}
              aria-label="Destacar"
            >
              <Highlighter size={16} strokeWidth={2.5} />
            </button>
          )}

          {isAllowed('link') && (
            <button
              type="button"
              onClick={() => {
                if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                  return;
                }
                const url = window.prompt('URL do Link:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              disabled={disabled}
              className={`${styles.toolbarBtn} ${editor.isActive('link') ? styles.toolbarBtnActive : ''}`}
              aria-label="Adicionar Link"
            >
              <LinkIcon size={16} strokeWidth={2.5} />
            </button>
          )}

          {(isAllowed('bulletList') || isAllowed('orderedList')) && (
            <div className={styles.toolbarDivider} />
          )}

          {isAllowed('bulletList') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              disabled={disabled}
              className={`${styles.toolbarBtn} ${editor.isActive('bulletList') ? styles.toolbarBtnActive : ''}`}
              aria-label="Lista com marcadores"
            >
              <List size={16} strokeWidth={2.5} />
            </button>
          )}

          {isAllowed('orderedList') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={disabled}
              className={`${styles.toolbarBtn} ${editor.isActive('orderedList') ? styles.toolbarBtnActive : ''}`}
              aria-label="Lista numerada"
            >
              <ListOrdered size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <EditorContent editor={editor} className={styles.editorContainer} />

        {maxLength && (
          <div className={styles.footer}>
            <span
              data-testid="char-counter"
              className={`${styles.counter} ${isNearLimit ? styles.counterWarning : ''}`}
            >
              {currentChars}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  },
);

RichTextEditor.displayName = 'RichTextEditor';
