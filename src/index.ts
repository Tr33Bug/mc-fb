import { createCliRenderer, BoxRenderable, TextRenderable } from '@opentui/core';
import { FileSystem } from './fileSystem';
import { KeyboardHandler, KeyCode } from './keyboard';
import type { SimpleState } from './types';

async function main() {
  const renderer = await createCliRenderer({
    stdout: process.stdout,
    stdin: process.stdin,
    exitOnCtrlC: false,
    useAlternateScreen: true,
  });

  const fileSystem = new FileSystem();
  const keyboard = new KeyboardHandler();
  
  // Initialize state
  const state: SimpleState = {
    currentPath: process.cwd(),
    items: [],
    selectedIndex: 0,
    scrollOffset: 0,
    error: null,
    history: [],
  };

  // UI element references
  let fileListBox: BoxRenderable;
  let statusBar: TextRenderable;
  let scrollIndicatorTop: TextRenderable;
  let scrollIndicatorBottom: TextRenderable;
  let fileItems: TextRenderable[] = [];

  // Calculate viewport dimensions
  const VIEWPORT_HEIGHT = renderer.height - 4; // Account for borders and status bar
  const MAX_VISIBLE_ITEMS = Math.max(1, VIEWPORT_HEIGHT - 2); // Leave room for scroll indicators

  try {
    // Load initial directory
    state.items = await fileSystem.listDirectory(state.currentPath);

    // Create main container
    const mainBox = new BoxRenderable('main-box', {
      width: '100%',
      height: '100%',
      border: true,
      borderStyle: 'single',
      title: 'Miller Column File Browser',
      titleAlignment: 'center',
    });

    // Create file list container with fixed height
    fileListBox = new BoxRenderable('file-list', {
      width: '100%',
      height: VIEWPORT_HEIGHT,
      border: false,
    });

    // Create scroll indicators
    scrollIndicatorTop = new TextRenderable('scroll-top', {
      content: '',
      fg: 'yellow',
    });
    scrollIndicatorTop.x = 2;
    scrollIndicatorTop.y = 0;

    scrollIndicatorBottom = new TextRenderable('scroll-bottom', {
      content: '',
      fg: 'yellow',
    });
    scrollIndicatorBottom.x = 2;
    scrollIndicatorBottom.y = MAX_VISIBLE_ITEMS + 1;

    // Create status bar
    statusBar = new TextRenderable('status', {
      content: `Path: ${state.currentPath} | Files: ${state.items.length} | ↑↓ Navigate | q: Quit`,
    });
    statusBar.y = VIEWPORT_HEIGHT + 1;

    // Function to calculate scroll offset
    function updateScrollOffset() {
      // Auto-scroll to keep selected item visible
      if (state.selectedIndex < state.scrollOffset) {
        state.scrollOffset = state.selectedIndex;
      } else if (state.selectedIndex >= state.scrollOffset + MAX_VISIBLE_ITEMS) {
        state.scrollOffset = state.selectedIndex - MAX_VISIBLE_ITEMS + 1;
      }
    }

    // Function to render file list with viewport scrolling
    function renderFileList() {
      // Clear existing items
      fileItems.forEach(item => fileListBox.remove(item.id));
      fileItems = [];
      
      // Remove old scroll indicators
      fileListBox.remove(scrollIndicatorTop.id);
      fileListBox.remove(scrollIndicatorBottom.id);

      // Calculate visible range
      updateScrollOffset();
      const visibleStart = state.scrollOffset;
      const visibleEnd = Math.min(state.items.length, state.scrollOffset + MAX_VISIBLE_ITEMS);

      // Add top scroll indicator if needed
      if (visibleStart > 0) {
        scrollIndicatorTop.content = `↑ ${visibleStart} more`;
        fileListBox.add(scrollIndicatorTop);
      }

      // Add visible file items
      for (let i = visibleStart; i < visibleEnd; i++) {
        const item = state.items[i];
        if (!item) continue;

        const isSelected = i === state.selectedIndex;
        const prefix = isSelected ? '> ' : '  ';
        const content = prefix + fileSystem.formatItemName(item);
        
        // Calculate display position (relative to viewport)
        const displayY = i - visibleStart + (visibleStart > 0 ? 1 : 0);
        
        const itemText = new TextRenderable(`item-${i}`, {
          content: content,
          fg: isSelected ? 'cyan' : undefined,
        });
        itemText.y = displayY;
        itemText.x = 1;
        fileListBox.add(itemText);
        fileItems.push(itemText);
      }

      // Add bottom scroll indicator if needed
      if (visibleEnd < state.items.length) {
        scrollIndicatorBottom.content = `↓ ${state.items.length - visibleEnd} more`;
        scrollIndicatorBottom.y = Math.min(MAX_VISIBLE_ITEMS, state.items.length - visibleStart) + (visibleStart > 0 ? 1 : 0);
        fileListBox.add(scrollIndicatorBottom);
      }

      // Update status bar
      const selectedItem = state.items[state.selectedIndex];
      const itemInfo = selectedItem 
        ? ` | Selected: ${selectedItem.name}${selectedItem.isDirectory ? '/' : ''}`
        : '';
      const scrollInfo = state.items.length > MAX_VISIBLE_ITEMS 
        ? ` | ${state.selectedIndex + 1}/${state.items.length}`
        : '';
      statusBar.content = `Path: ${state.currentPath} | Files: ${state.items.length}${itemInfo}${scrollInfo} | ↑↓: Navigate | q: Quit`;
    }

    // Initial render
    renderFileList();

    // Add elements to main box
    mainBox.add(fileListBox);
    mainBox.add(statusBar);
    renderer.root.add(mainBox);

    // Setup keyboard handlers
    keyboard.on(KeyCode.UP, () => {
      if (state.selectedIndex > 0) {
        state.selectedIndex--;
        renderFileList();
        renderer.needsUpdate();
      }
    });

    keyboard.on(KeyCode.DOWN, () => {
      if (state.selectedIndex < state.items.length - 1) {
        state.selectedIndex++;
        renderFileList();
        renderer.needsUpdate();
      }
    });

    // Page navigation for faster scrolling
    keyboard.on(KeyCode.PAGE_UP, () => {
      const pageSize = Math.max(1, MAX_VISIBLE_ITEMS - 1);
      state.selectedIndex = Math.max(0, state.selectedIndex - pageSize);
      renderFileList();
      renderer.needsUpdate();
    });

    keyboard.on(KeyCode.PAGE_DOWN, () => {
      const pageSize = Math.max(1, MAX_VISIBLE_ITEMS - 1);
      state.selectedIndex = Math.min(state.items.length - 1, state.selectedIndex + pageSize);
      renderFileList();
      renderer.needsUpdate();
    });

    keyboard.on(KeyCode.HOME, () => {
      state.selectedIndex = 0;
      renderFileList();
      renderer.needsUpdate();
    });

    keyboard.on(KeyCode.END, () => {
      state.selectedIndex = Math.max(0, state.items.length - 1);
      renderFileList();
      renderer.needsUpdate();
    });

    keyboard.on(KeyCode.Q, () => cleanup());
    keyboard.on(KeyCode.Q_UPPER, () => cleanup());
    keyboard.on(KeyCode.CTRL_C, () => cleanup());
    keyboard.on(KeyCode.ESC, () => cleanup());

    // Handle keyboard input
    process.stdin.setRawMode(true);
    process.stdin.on('data', (data) => {
      keyboard.handle(data);
    });

    // Start rendering
    renderer.start();

    function cleanup() {
      renderer.stop();
      process.stdin.setRawMode(false);
      process.exit(0);
    }

    // Handle graceful exit
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    console.error('Error:', error);
    renderer.stop();
    process.stdin.setRawMode(false);
    process.exit(1);
  }
}

main().catch(console.error);