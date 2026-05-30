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
