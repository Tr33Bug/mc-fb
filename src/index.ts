import { createCliRenderer, BoxRenderable, TextRenderable } from '@opentui/core';
import { FileSystem } from './fileSystem';
import type { SimpleState } from './types';

async function main() {
  const renderer = await createCliRenderer({
    stdout: process.stdout,
    stdin: process.stdin,
    exitOnCtrlC: false,
    useAlternateScreen: true,
  });

  const fileSystem = new FileSystem();
  
  // Initialize state
  const state: SimpleState = {
    currentPath: process.cwd(), // Start in current working directory
    items: [],
    selectedIndex: 0,
    error: null,
    history: [],
  };

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
    const fileListBox = new BoxRenderable('file-list', {
      width: '100%',
      height: '90%',
      border: false,
    });

    // Create status bar
    const statusBar = new TextRenderable('status', {
      content: `Path: ${state.currentPath} | Files: ${state.items.length} | Press 'q' to quit`,
    });
    statusBar.y = -2; // Position at bottom

    // Add file items to the list
    state.items.forEach((item, index) => {
      const itemText = new TextRenderable(`item-${index}`, {
        content: fileSystem.formatItemName(item),
      });
      itemText.y = index;
      itemText.x = 2;
      fileListBox.add(itemText);
    });

    // Add elements to main box
    mainBox.add(fileListBox);
    mainBox.add(statusBar);
    renderer.root.add(mainBox);

    // Handle keyboard input
    process.stdin.setRawMode(true);
    process.stdin.on('data', (data) => {
      const key = data.toString();
      if (key === 'q' || key === 'Q' || key === '\u0003') { // \u0003 is Ctrl+C
        cleanup();
        process.exit(0);
      }
    });

    // Start rendering
    renderer.start();

    function cleanup() {
      renderer.stop();
      process.stdin.setRawMode(false);
    }

    // Handle graceful exit
    process.on('SIGINT', () => {
      cleanup();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      cleanup();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error:', error);
    renderer.stop();
    process.stdin.setRawMode(false);
    process.exit(1);
  }
}

main().catch(console.error);