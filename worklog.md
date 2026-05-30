---
Task ID: 1
Agent: main
Task: Make Noticias Destacadas fully editable with photo upload support

Work Log:
- Analyzed current NewsItem interface (missing imageUrl/imageDataUrl/order/active fields)
- Updated NewsItem interface in mock-data.ts to add imageUrl, imageDataUrl, order, active fields
- Updated all 7 mock news items with the new fields
- Created dedicated NewsEditor.tsx component (470+ lines) with:
  - Full CRUD: Create, Read, Update, Delete news items
  - Image upload with drag-and-drop, WebP conversion, URL mode
  - Reorder with up/down arrows
  - Toggle active/inactive per news item
  - Duplicate news items
  - Live preview card while editing
  - Category selector, date picker, team/flag selector
  - Two-column layout (list + editor) matching SliderEditor pattern
- Updated EditorTab.tsx to use NewsEditor instead of inline basic editor
- Removed old news-related state/functions/dialog from EditorTab.tsx (cleanup)
- Updated HomeTab.tsx to:
  - Use custom images (imageDataUrl || imageUrl) when available
  - Fall back to team flags when no custom image
  - Filter by active status
  - Sort by order field

Stage Summary:
- NewsItem now fully supports custom images via upload or URL
- NewsEditor component provides complete editing UI with image upload
- HomeTab respects custom images, active status, and display order
- Build compiles successfully with no errors
- Dev server running and rendering correctly

---
Task ID: 2
Agent: main
Task: Update NewsItem interface to support photo galleries and additional editing fields

Work Log:
- Added GalleryImage interface (id, url, dataUrl, caption, order) before NewsItem interface
- Updated NewsItem interface with new fields:
  - content: string (full article body text)
  - gallery: GalleryImage[] (photo gallery support)
  - author: string (article author)
  - source: string (news source)
  - tags: string[] (categorization tags)
  - featured: boolean (highlighted news flag)
- Updated all 7 news items (n1-n7) with:
  - content: 2-3 paragraphs of Spanish text about World Cup 2026
  - gallery: empty array [] for all items
  - author: realistic Spanish names (Carlos Méndez, María García, Javier Rodríguez, Roberto Sánchez, Ana López, Miguel Torres, Laura Martínez)
  - source: realistic sources (ESPN, TyC Sports, Depor, MEDYO, Marca, Record, Fox Sports)
  - tags: 2-3 relevant tags per item
  - featured: true for n1 and n2, false for n3-n7
- Lint check passes with no new errors (4 pre-existing errors in unrelated files)

Stage Summary:
- NewsItem interface now supports photo galleries via GalleryImage[]
- New metadata fields (author, source, tags, featured) enable richer content management
- content field provides full article body text for each news item
- All mock data updated with Spanish-language content about World Cup 2026
- No breaking changes to existing functionality
