---
Task ID: 1
Agent: Main Agent
Task: Fix broken images and implement WebP conversion upload

Work Log:
- Analyzed all image references in the project (banners, slider slides, news cards, flag images)
- Identified that all 12 banner images reference `/banners/*.jpg` paths that DON'T EXIST in `/public/banners/`
- Added `imgError` state and `onError` handler to BannerDisplay.tsx BannerPastilla component
- Added `imgErrors` state and `onError` handler to MatchSlider.tsx for slider background images
- Added `onError` handler to GroupsTab.tsx flag images to hide broken flags gracefully
- Rewrote `/src/app/api/upload/route.ts` to use Sharp for WebP conversion (quality 80)
- Updated ImageUploader.tsx to show compression info after upload (original size → compressed size, savings %)
- Created `/public/uploads/` directory structure (general, banners, slides subdirs)
- Improved button contrast in Navbar.tsx: added borders, font-bold, better active/hover states
- Improved button contrast in HomeTab.tsx: added hoverColor states, border-2, font-bold, shadow-md
- Improved button contrast in LoginTab.tsx: added font-bold, text-white, shadow-md

Stage Summary:
- Broken images now gracefully fall back to bgColor gradients instead of showing broken image icons
- Upload API now converts all images to WebP format for 30-70% size reduction
- ImageUploader shows compression savings info after upload
- Button contrast significantly improved across Navbar, HomeTab, and LoginTab
- All changes compile successfully with `next build`
