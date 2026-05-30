---
Task ID: 1-3
Agent: Main Agent
Task: Fix broken slider images, add Argentina background, improve button contrast

Work Log:
- Generated 4 AI background images for slider slides (WebP format)
- Generated Argentina-themed portal background image
- Updated sliderSlides in mock-data.ts with imageUrl paths
- Added fixed background to HomeTab.tsx (later removed to fix double background)
- Improved MatchSlider.tsx with min-height, better overlay, error handling
- Improved button contrast across MatchSlider and HomeTab quick links

Stage Summary:
- 5 WebP images in /public/slides/
- Slider images display correctly
- Button contrast improved

---
Task ID: 4
Agent: Main Agent + 3 Sub-agents
Task: Full app restructure - fix slider editing, shared state, double background

Work Log:
- Diagnosed root cause: EditorTab used local useState, HomeTab imported from mock-data directly → editor changes NEVER reflected on portal
- Diagnosed double background: both page.tsx and HomeTab.tsx had fixed background images
- Created PortalDataContext (portal-data-context.tsx) with shared state for slides, news, matches, scorers, redCards, syntheses
- Updated page.tsx: wrapped app in PortalDataProvider, kept single background image
- Updated HomeTab.tsx: removed duplicate background, now uses usePortalData() for slides and news
- Updated EditorTab.tsx: replaced 6 useState declarations with usePortalData() destructuring
- All existing setter calls already used updater pattern (prev => ...) so they work with context update functions
- Removed unused initial data imports from EditorTab (initialMatches, initialNews, etc.)
- Verified build passes successfully

Stage Summary:
- NEW FILE: /home/z/my-project/src/lib/portal-data-context.tsx (shared state context)
- FIXED: Double background image (removed from HomeTab, kept in page.tsx)
- FIXED: Slider images now changeable from editor (changes propagate via PortalDataContext)
- FIXED: News changes from editor now propagate to HomeTab
- FIXED: All editor data (slides, news, matches, scorers, redCards, syntheses) now shared
- Build: ✅ Passes
