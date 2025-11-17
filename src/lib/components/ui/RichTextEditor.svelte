<script>
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Underline } from '@tiptap/extension-underline';
  import { Link } from '@tiptap/extension-link';
  import { TextAlign } from '@tiptap/extension-text-align';
  import { TextStyle } from '@tiptap/extension-text-style';
  import { Color } from '@tiptap/extension-color';
  import { Highlight } from '@tiptap/extension-highlight';
  import { Table } from '@tiptap/extension-table';
  import { TableRow } from '@tiptap/extension-table-row';
  import { TableCell } from '@tiptap/extension-table-cell';
  import { TableHeader } from '@tiptap/extension-table-header';

  export let value = '';
  export let name = 'content';
  export let id = '';

  let editor;
  let element;
  let hiddenInput;
  let showLinkModal = false;
  let linkUrl = '';

  function handleModalKeydown(e, closeModal) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-admin-blue underline'
          }
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true
        }),
        Table.configure({
          resizable: true
        }),
        TableRow,
        TableHeader,
        TableCell
      ],
      content: value,
      editorProps: {
        attributes: {
          class: 'prose max-w-none focus:outline-none min-h-[300px] px-4 py-3'
        }
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        if (hiddenInput) {
          hiddenInput.value = html;
        }
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  function toggleBold() {
    editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor.chain().focus().toggleItalic().run();
  }

  function toggleUnderline() {
    editor.chain().focus().toggleUnderline().run();
  }

  function toggleStrike() {
    editor.chain().focus().toggleStrike().run();
  }

  function toggleHeading(level) {
    editor.chain().focus().toggleHeading({ level }).run();
  }

  function setParagraph() {
    editor.chain().focus().setParagraph().run();
  }

  function toggleBulletList() {
    editor.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor.chain().focus().toggleOrderedList().run();
  }

  function toggleBlockquote() {
    editor.chain().focus().toggleBlockquote().run();
  }

  function toggleCodeBlock() {
    editor.chain().focus().toggleCodeBlock().run();
  }

  function setTextAlign(align) {
    editor.chain().focus().setTextAlign(align).run();
  }

  function insertHorizontalRule() {
    editor.chain().focus().setHorizontalRule().run();
  }

  function undo() {
    editor.chain().focus().undo().run();
  }

  function redo() {
    editor.chain().focus().redo().run();
  }

  function openLinkModal() {
    const previousUrl = editor.getAttributes('link').href;
    linkUrl = previousUrl || '';
    showLinkModal = true;
  }

  function setLink() {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    showLinkModal = false;
    linkUrl = '';
  }

  function removeLink() {
    editor.chain().focus().unsetLink().run();
    showLinkModal = false;
  }

  function setColor(color) {
    editor.chain().focus().setColor(color).run();
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }
</script>

<div {id} class="border border-admin-border rounded-lg overflow-hidden bg-white">
  <!-- Toolbar -->
  <div class="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-admin-border">
    <!-- Format dropdown -->
    <select on:change={(e) => {
      const val = e.target.value;
      if (val === 'p') setParagraph();
      else toggleHeading(parseInt(val));
      e.target.value = 'p';
    }} class="px-2 py-1 text-sm border border-admin-border rounded bg-white">
      <option value="p">Paragraph</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
      <option value="4">Heading 4</option>
      <option value="5">Heading 5</option>
      <option value="6">Heading 6</option>
    </select>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Text formatting -->
    <button type="button" on:click={toggleBold} class="px-2 py-1 rounded hover:bg-admin-blue/10 font-bold text-sm" title="Bold">B</button>
    <button type="button" on:click={toggleItalic} class="px-2 py-1 rounded hover:bg-admin-blue/10 italic text-sm" title="Italic">I</button>
    <button type="button" on:click={toggleUnderline} class="px-2 py-1 rounded hover:bg-admin-blue/10 underline text-sm" title="Underline">U</button>
    <button type="button" on:click={toggleStrike} class="px-2 py-1 rounded hover:bg-admin-blue/10 line-through text-sm" title="Strikethrough">S</button>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Lists -->
    <button type="button" on:click={toggleBulletList} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Bullet List">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
      </svg>
    </button>
    <button type="button" on:click={toggleOrderedList} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Numbered List">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
        <text x="3" y="8" font-size="8" fill="currentColor">1.</text>
        <text x="3" y="14" font-size="8" fill="currentColor">2.</text>
        <text x="3" y="20" font-size="8" fill="currentColor">3.</text>
      </svg>
    </button>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Alignment -->
    <button type="button" on:click={() => setTextAlign('left')} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Align Left">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
      </svg>
    </button>
    <button type="button" on:click={() => setTextAlign('center')} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Align Center">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
      </svg>
    </button>
    <button type="button" on:click={() => setTextAlign('right')} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Align Right">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <button type="button" on:click={() => setTextAlign('justify')} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Justify">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Link -->
    <button type="button" on:click={openLinkModal} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Insert Link">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    </button>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Text Color -->
    <input type="color" on:input={(e) => setColor(e.target.value)} class="w-8 h-6 border border-admin-border rounded cursor-pointer" title="Text Color" />

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Blockquote & Code -->
    <button type="button" on:click={toggleBlockquote} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Blockquote">"</button>
    <button type="button" on:click={toggleCodeBlock} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm font-mono" title="Code Block">&lt;/&gt;</button>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Table & HR -->
    <button type="button" on:click={insertTable} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Insert Table">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/>
      </svg>
    </button>
    <button type="button" on:click={insertHorizontalRule} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Horizontal Rule">—</button>

    <div class="w-px h-6 bg-admin-border"></div>

    <!-- Undo/Redo -->
    <button type="button" on:click={undo} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Undo">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
      </svg>
    </button>
    <button type="button" on:click={redo} class="px-2 py-1 rounded hover:bg-admin-blue/10 text-sm" title="Redo">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/>
      </svg>
    </button>
  </div>

  <!-- Editor -->
  <div bind:this={element} class="bg-white"></div>
  <input type="hidden" {name} bind:this={hiddenInput} value={value} />
</div>

<!-- Link Modal -->
{#if showLinkModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" tabindex="0" on:click={() => (showLinkModal = false)} on:keydown={(e) => handleModalKeydown(e, () => (showLinkModal = false))}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="bg-white rounded-lg p-6 w-96 max-w-full" on:click|stopPropagation>
      <h3 class="text-lg font-semibold mb-4">Insert Link</h3>
      <input type="url" bind:value={linkUrl} placeholder="https://example.com" class="w-full border border-admin-border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-admin-blue" />
      <div class="flex gap-2 justify-end">
        <button type="button" on:click={removeLink} class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Remove</button>
        <button type="button" on:click={() => (showLinkModal = false)} class="px-4 py-2 text-sm border border-admin-border rounded-lg">Cancel</button>
        <button type="button" on:click={setLink} class="px-4 py-2 text-sm bg-admin-blue text-white rounded-lg">Insert</button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.ProseMirror) {
    min-height: 300px;
  }

  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }

  :global(.ProseMirror h1) {
    font-size: 2em;
    font-weight: 700;
    margin-top: 1em;
    margin-bottom: 0.5em;
    line-height: 1.2;
  }

  :global(.ProseMirror h2) {
    font-size: 1.75em;
    font-weight: 600;
    margin-top: 1em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }

  :global(.ProseMirror h3) {
    font-size: 1.5em;
    font-weight: 600;
    margin-top: 0.75em;
    margin-bottom: 0.5em;
    line-height: 1.4;
  }

  :global(.ProseMirror h4) {
    font-size: 1.25em;
    font-weight: 600;
    margin-top: 0.75em;
    margin-bottom: 0.5em;
  }

  :global(.ProseMirror h5) {
    font-size: 1.1em;
    font-weight: 600;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  :global(.ProseMirror h6) {
    font-size: 1em;
    font-weight: 600;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  :global(.ProseMirror ul),
  :global(.ProseMirror ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  :global(.ProseMirror li) {
    margin: 0.25em 0;
  }

  :global(.ProseMirror strong) {
    font-weight: 600;
  }

  :global(.ProseMirror em) {
    font-style: italic;
  }

  :global(.ProseMirror u) {
    text-decoration: underline;
  }

  :global(.ProseMirror s) {
    text-decoration: line-through;
  }

  :global(.ProseMirror p) {
    margin: 0.5em 0;
  }

  :global(.ProseMirror blockquote) {
    border-left: 4px solid #ddd;
    padding-left: 1em;
    margin: 1em 0;
    color: #666;
    font-style: italic;
  }

  :global(.ProseMirror pre) {
    background: #f5f5f5;
    border-radius: 0.5em;
    padding: 1em;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    margin: 1em 0;
  }

  :global(.ProseMirror code) {
    background: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  :global(.ProseMirror hr) {
    border: none;
    border-top: 2px solid #ddd;
    margin: 2em 0;
  }

  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em 0;
  }

  :global(.ProseMirror table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  :global(.ProseMirror table td),
  :global(.ProseMirror table th) {
    border: 1px solid #ddd;
    padding: 0.5em;
    text-align: left;
  }

  :global(.ProseMirror table th) {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  :global(.ProseMirror a) {
    color: #2563eb;
    text-decoration: underline;
  }
</style>
