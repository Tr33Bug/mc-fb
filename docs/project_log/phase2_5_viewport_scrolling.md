# Phase 2.5: Viewport Scrolling Fix

## Summary
Implement viewport-based rendering to fix critical overflow issue where files render outside window boundaries

## Changes
- Added `scrollOffset` to state for tracking viewport position
- Calculate visible viewport height (terminal height - borders - status bar)
- Implement viewport window rendering (only show MAX_VISIBLE_ITEMS at once)
- Auto-scroll to keep selected item visible
- Added scroll indicators showing "↑ X more" and "↓ Y more"
- Added position counter (e.g., "5/20") in status bar
- Bonus: Added Page Up/Down, Home, End keys for faster navigation

## Technical Details
- `MAX_VISIBLE_ITEMS` calculated based on terminal height
- `updateScrollOffset()` ensures selected item is always visible
- Only renders items within viewport range (scrollOffset to scrollOffset + MAX_VISIBLE_ITEMS)
- Scroll indicators appear when content exceeds viewport

## Key Features
1. **Viewport Clipping**: Files no longer overflow window boundaries
2. **Auto-scroll**: Selected item automatically scrolls into view
3. **Scroll Indicators**: Yellow text shows how many items are above/below
4. **Position Counter**: Status bar shows current position (e.g., "5/20")
5. **Fast Navigation**: Page Up/Down moves by viewport size, Home/End jumps to start/end

## Files Modified
- `src/types.ts` - Added scrollOffset to SimpleState
- `src/index.ts` - Implemented viewport scrolling logic
- `src/keyboard.ts` - Added PAGE_UP, PAGE_DOWN, HOME, END key codes

## Testing
- Empty directories: No scroll indicators needed
- Small directories (<15 files): Fits in viewport, no scrolling
- Large directories (20+ files): Proper scrolling with indicators
- Very large directories (100+ files): Performance remains good

## Result
✅ Critical overflow issue fixed - files now properly contained within window boundaries with smooth scrolling

## Next Steps
Ready for Phase 3: Folder Navigation