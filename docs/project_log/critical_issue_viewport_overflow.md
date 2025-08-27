# Critical Issue: Viewport Overflow

## Discovery
- **Date**: Aug 28, 2024
- **Discovered By**: User testing
- **Phase**: Post-Phase 2 testing

## Issue Description
Files overflow below the status bar when directories contain more items than fit in the viewport. This renders files outside the visible window boundaries, making them inaccessible.

## Evidence
- User screenshot shows files rendering below UI boundaries
- Status bar at bottom is overlapped by file list
- No scrolling mechanism to access overflow items

## Impact
- **Severity**: CRITICAL
- **Affected Users**: All users with directories containing 15+ files
- **Functionality**: Blocks navigation to items below viewport

## Root Cause
- No viewport height calculation implemented
- File list renders all items without considering container bounds
- Missing scroll offset management

## Proposed Solution

### Immediate Fix (Phase 2.5)
```typescript
// Calculate visible area
const visibleHeight = containerHeight - 4; // Account for borders and status
const maxVisibleItems = Math.floor(visibleHeight);

// Track scroll state
let scrollOffset = 0;

// Only render visible window
const visibleItems = state.items.slice(
  scrollOffset, 
  scrollOffset + maxVisibleItems
);

// Auto-scroll to keep selection visible
if (selectedIndex >= scrollOffset + maxVisibleItems) {
  scrollOffset = selectedIndex - maxVisibleItems + 1;
} else if (selectedIndex < scrollOffset) {
  scrollOffset = selectedIndex;
}
```

### UI Indicators
- Add "↑ X more" at top when scrolled down
- Add "↓ Y more" at bottom when more items exist
- Ensure selected item always visible

## Testing Plan
1. Test with empty directory
2. Test with 5 files (fits in viewport)
3. Test with 30 files (requires scrolling)
4. Test with 100+ files (stress test)
5. Test navigation at boundaries

## Status
- **Priority**: P0 - Must fix before Phase 3
- **Assigned**: Next immediate task
- **Blocking**: Phase 3 development