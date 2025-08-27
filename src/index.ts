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
    error: null,
    history: [],
  };

  // UI element references
  let fileListBox: BoxRenderable;
  let statusBar: TextRenderable;
  let fileItems: TextRenderable[] = [];

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

    // Create file list container
    fileListBox = new BoxRenderable('file-list', {
      width: '100%',
      height: '90%',
      border: false,
    });

    // Create status bar
    statusBar = new TextRenderable('status', {
      content: `Path: ${state.currentPath} | Files: ${state.items.length} | ↑↓ Navigate | q: Quit`,
    });
    statusBar.y = -2;

    // Function to render file list
    function renderFileList() {
      // Clear existing items
      fileItems.forEach(item => fileListBox.remove(item.id));
      fileItems = [];

      // Add file items with selection indicator
      state.items.forEach((item, index) => {
        const isSelected = index === state.selectedIndex;
        const prefix = isSelected ? '> ' : '  ';
        const content = prefix + fileSystem.formatItemName(item);
        
        const itemText = new TextRenderable(`item-${index}`, {
          content: content,
          fg: isSelected ? 'cyan' : undefined,
        });
        itemText.y = index;
        itemText.x = 1;
        fileListBox.add(itemText);
        fileItems.push(itemText);
      });

      // Update status bar
      const selectedItem = state.items[state.selectedIndex];
      const itemInfo = selectedItem 
        ? ` | Selected: ${selectedItem.name}${selectedItem.isDirectory ? '/' : ''}`
        : '';
      statusBar.content = `Path: ${state.currentPath} | Files: ${state.items.length}${itemInfo} | ↑↓: Navigate | q: Quit`;
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