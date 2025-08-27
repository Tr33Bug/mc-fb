# Miller Column File Browser - Requirements

## Project Overview
A minimal terminal-based file browser with miller column navigation, built using the OpenTUI framework for native terminal execution.

## Development Approach
**Week 1**: Single-column file browser MVP with basic navigation and file opening
**Week 2**: Expand to miller columns with multi-column navigation

## MVP Requirements (Week 1)

### Core Functionality
1. **Single column file browser**
   - Start in current working directory
   - Show all files including hidden files (.files)
   - Sort with folders first, then files (alphabetical)
2. **Navigate folders with arrow keys**
   - Up/Down arrows for selection
   - Right arrow to enter folder
   - Left arrow to go to parent
3. **Open files with system command**
   - Right arrow on file executes open/xdg-open
4. **Quit with 'q' key**
5. **Show current path at bottom**
6. **Basic error handling with status line**

### Technical Scope
- Unix systems only (macOS, Linux, WSL)
- Terminal-based interface
- No configuration needed
- Start in current working directory

## Full Feature Requirements (Week 2)

### 1. Terminal User Interface (TUI)
- **Framework**: OpenTUI (@opentui/core)
- **Runtime**: Native terminal execution
- **No external GUI dependencies**

### 2. Miller Column Layout (Week 2)
- **Fixed 3-column layout at all times**
- **Column 1**: Parent directory
  - Shows "(root)" grayed out when at root /
  - Shows parent directory contents otherwise
- **Column 2**: Current directory (always focused)
  - Shows current directory contents
  - Selection highlighted
- **Column 3**: Child/Preview
  - If selection is folder: Show its contents
  - If selection is file: Show filename with 📄 icon
- **Column Width**: Each column exactly 1/3 of terminal width
- **Long filenames**: Truncated with `...`
- **Icons**: 📁 for folders, 📄 for files

### 3. Keyboard Navigation

#### Arrow Key Controls
- **Up Arrow (↑)**: Move selection up within current column
- **Down Arrow (↓)**: Move selection down within current column
- **Left Arrow (←)**: Move focus to parent column (go back)
- **Right Arrow (→)**: 
  - On folder: Enter the folder (create new column)
  - On file: Execute system `open` command

#### Additional Controls
- **Enter**: Alternative action to open file/folder
- **q**: Quit the application
- **ESC**: Exit the application

### 4. File Operations
- **Display all files and folders (including hidden)**
- **Sorting**: Folders first, then files, alphabetical order
- **Visual distinction**: 
  - Week 1: Text-based (folders might have `/` suffix)
  - Week 2: Icons (📁 for folders, 📄 for files)
- **Execute system `open` command (macOS) or `xdg-open` (Linux)**
- **Handle permission errors gracefully**

### 5. Error Handling
- **Display error messages when `open` command fails**
- **Show errors in status bar or dedicated error area**
- **Non-blocking errors (app continues running)**
- **Clear error messages after user action**

### 6. Visual Design
- **Minimal and clean interface**
- **Clear selection indicator (highlight or marker)**
- **Path display showing current location**
- **Responsive to terminal resize**
- **Viewport clipping (files don't overflow window boundaries)**
- **Scroll indicators when content exceeds viewport**

## Non-Functional Requirements

### Performance
- **Fast navigation response time (<100ms)**
- **Efficient handling of large directories**
- **Smooth scrolling for long file lists**
- **Viewport-based rendering (only visible items rendered)**
- **Auto-scroll selected item into view**

### Usability
- **Intuitive navigation matching standard file browser patterns**
- **Clear visual feedback for user actions**
- **Consistent behavior across different terminal emulators**

### Compatibility
- **Unix-based systems only (macOS, Linux)**
- **Windows support via WSL (Windows Subsystem for Linux)**
- **Work with standard Unix terminal emulators**
- **Handle various terminal sizes**

## Technical Constraints

### Technology Stack
- **Language**: TypeScript
- **UI Framework**: OpenTUI
- **Runtime**: Node.js or Bun
- **Build System**: TypeScript compiler

### Dependencies
- **@opentui/core**: Core TUI framework
- **Node.js fs module**: File system operations
- **Node.js child_process**: Execute system commands

## Future Enhancements (Post Week 2)
- Configuration file for:
  - Toggle hidden files visibility
  - Custom sorting options
  - Color schemes
- File preview pane (actual content preview)
- Search functionality
- File operations (copy, move, delete)
- Bookmarks/favorites
- Vim-style navigation keys
- Different icons for file types (.js, .md, .png, etc.)
- File size and date display
- Symlink handling
- Breadcrumb navigation

## Success Criteria

### Week 1 MVP
1. Application starts and shows files in current directory
2. Arrow keys navigate up/down
3. Enter folders with right arrow
4. Go back with left arrow
5. Open files with right arrow
6. Quit with 'q' key
7. Works on macOS and Linux

### Week 2 Full Version
1. Fixed 3-column miller layout
2. Column 1: Parent directory
3. Column 2: Current directory (focused)
4. Column 3: Child directory or file preview
5. Navigate with left/right arrows
6. File selection shows filename with icon in column 3
7. Handle 100+ files smoothly
8. All Week 1 features still work
9. No crashes during normal use