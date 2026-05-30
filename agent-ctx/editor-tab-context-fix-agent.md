# Task: Fix EditorTab.tsx to use shared PortalDataContext

## Summary
Updated EditorTab.tsx to use `usePortalData()` from `@/lib/portal-data-context` instead of local `useState` for all shared data, so that editor changes propagate to all display components.

## Changes Made

### 1. `/home/z/my-project/src/lib/portal-data-context.tsx` (Updated)
- Expanded from slides-only context to full shared data context
- Added all 6 data types: `slides`, `news`, `matches`, `scorers`, `redCards`, `syntheses`
- Added all 6 updater functions: `updateSlides`, `updateNews`, `updateMatches`, `updateScorers`, `updateRedCards`, `updateSyntheses`
- Updater functions take `(prev: T[]) => T[]` callback form (same as useState setters)
- Each updater wrapped in `useCallback` for stability
- Uses mock-data initial values for default state

### 2. `/home/z/my-project/src/components/portal/EditorTab.tsx` (Updated)
- Added import: `import { usePortalData } from '@/lib/portal-data-context';`
- Replaced 6 `useState` declarations with single `usePortalData()` destructuring
- Aliased context values to maintain same variable names (e.g., `slides: localSlides`, `updateSlides: setLocalSlides`)
- Removed unused initial data imports from mock-data (`initialMatches`, `initialNews`, etc.)
- Kept type imports and `getTeamById` from mock-data
- All existing setter calls already used updater form `(prev => ...)` so no changes needed there
- `PortalDataProvider` was already wrapping the app in `page.tsx`

## Verification
- Build passes successfully (`npx next build` ✅)
- Dev server compiles without errors
- All 11 setter call sites already used the updater form, so no signature changes were needed
