import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Custom TipTap extension to preserve inline styles and HTML attributes
 * when pasting content from external sources.
 * 
 * This extension ensures that all formatting including inline styles,
 * colors, fonts, alignment, etc. are preserved when pasting from
 * external sources like Word, Google Docs, or web pages.
 * 
 * The key insight is that TipTap normalizes HTML when parsing, which
 * strips inline styles. This extension intercepts the paste process
 * and ensures the raw HTML with all formatting is preserved and stored.
 */
export const PreserveFormatting = Extension.create({
  name: 'preserveFormatting',

  addGlobalAttributes() {
    return [
      {
        // Apply style attribute to block-level elements
        types: ['paragraph', 'heading', 'blockquote', 'codeBlock', 'horizontalRule'],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => {
              // Preserve inline style attribute from HTML
              const style = element.getAttribute('style')
              return style || null
            },
            renderHTML: (attributes) => {
              if (!attributes.style) {
                return {}
              }
              return {
                style: attributes.style,
              }
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('preserveFormatting'),
        props: {
          transformPastedHTML: (html: string) => {
            // This is the critical function that preserves formatting
            // It runs before TipTap parses the HTML, so we can clean
            // security risks while preserving all formatting
            
            if (typeof window === 'undefined') return html

            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = html

            // Remove security risks: scripts and event handlers
            const scripts = tempDiv.querySelectorAll('script, style[type="text/javascript"]')
            scripts.forEach(script => script.remove())

            // Remove event handlers but preserve ALL other attributes
            // This includes: style, class, id, data-*, and any other attributes
            const allElements = tempDiv.querySelectorAll('*')
            allElements.forEach(el => {
              Array.from(el.attributes).forEach(attr => {
                // Remove only event handlers (onclick, onload, etc.) for security
                // Preserve everything else including style, class, id, etc.
                if (attr.name.startsWith('on')) {
                  el.removeAttribute(attr.name)
                }
              })
            })

            // Return the cleaned HTML with ALL formatting preserved
            // TipTap will parse this, and our addGlobalAttributes ensures
            // style attributes are preserved in the schema
            return tempDiv.innerHTML
          },
        },
      }),
    ]
  },
})

