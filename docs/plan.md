# Miller Column File Browser - Implementation Plan

## System Architecture

### Core Components

#### 1. FileSystem Module
- **Purpose**: Handle all file system interactions
- **Responsibilities**:
  - List directory contents
  - Distinguish files from directories
  - Get file metadata (size, permissions, modified date)
  - Handle path resolution
  - Manage hidden files

#### 2. UI Components

##### MillerColumn Component
- Individual column rendering
- File/folder list display
- Selection state management
- Scrolling for long lists

##### ColumnManager
- Manage multiple column instances
- Handle column creation/destruction
- Coordinate focus between columns
- Maintain column hierarchy

##### FileList Component
- Render individual files/folders
- Apply visual styling (folders vs files)
- Handle selection highlighting

##### StatusBar Component
- Display current path
- Show error messages
- Display file count/info

#### 3. Navigation Controller
- **Purpose**: Central navigation logic
- **Responsibilities**:
  - Process keyboard events
  - Manage focus state
  - Track selection per column
  - Handle boundary conditions

#### 4. Command Executor
- **Purpose**: Interface with Unix system
- **Responsibilities**:
  - Execute `open` command (macOS) or `xdg-open` (Linux)
  - Handle command errors
  - Process command output

### Data Flow Architecture

```
┌─────────────────┐
│  User Input     │
│  (Arrow Keys)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Navigation    │◄──────┐
│   Controller    │       │
└────────┬────────┘       │
         │                │
    ┌────┴────┐           │
    ▼         ▼           │
┌──────┐  ┌──────────┐   │
│FS   │  │  Column  │   │
│Module│  │ Manager  ├───┘
└──────┘  └──────────┘
    │         │
    └────┬────┘
         ▼
┌─────────────────┐
│  Miller Columns │
│   UI Render     │
└─────────────────┘
```

### State Management

#### Week 1: Simple State
```typescript
// Start simple for single column
interface SimpleState {
  currentPath: string
  items: FileItem[]
  selectedIndex: number
  error: string | null
  history: string[] // for back navigation
}

interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  isHidden: boolean // starts with .
}
```

#### Week 2: Fixed 3-Column State
```typescript
// Fixed 3-column miller layout
interface MillerState {
  parentColumn: Column | null    // null if at root
  currentColumn: Column          // always present (focused)
  childColumn: Column | Preview | null  // folder contents or file preview
  error: string | null
}

interface Column {
  path: string
  items: FileItem[]
  selectedIndex: number
}

interface Preview {
  filename: string
  icon: string  // '📄' or specific file type icon
}
```

## UI/UX Design

### Visual Layout

```
┌──────────────────────────────────────────────────────┐
│ Miller Column File Browser                           │
├──────────────┬──────────────┬───────────────────────┤
│   Parent     │   Current    │   Child/Preview       │
│              │              │                       │
│ 📁 folder1   │ > 📁 .config │ 📄 .bashrc           │
│ 📁 folder2   │   📁 Documents│ 📄 .zshrc            │
│ > 📁 folder3 │   📁 Downloads│ 📁 nvim              │
│ 📄 .hidden   │   📄 file.txt │ 📁 fish              │
│ 📄 file.js   │   📄 image.png│                       │
│              │              │                       │
├──────────────┴──────────────┴───────────────────────┤
│ Path: /home/user/folder3/.config                     │
└──────────────────────────────────────────────────────┘
```

When a file is selected:
```
┌──────────────────────────────────────────────────────┐
│ Miller Column File Browser                           │
├──────────────┬──────────────┬───────────────────────┤
│   Parent     │   Current    │   Preview             │
│              │              │                       │
│ 📁 folder1   │   📁 .config  │                       │
│ 📁 folder2   │   📁 Documents│                       │
│ > 📁 folder3 │ > 📄 file.txt │   📄 file.txt         │
│ 📄 .hidden   │   📄 image.png│                       │
│ 📄 file.js   │   📄 .bashrc  │                       │
│              │              │                       │
├──────────────┴──────────────┴───────────────────────┤
│ Path: /home/user/folder3/file.txt                    │
└──────────────────────────────────────────────────────┘
```

At root directory:
```
┌──────────────────────────────────────────────────────┐
│ Miller Column File Browser                           │
├──────────────┬──────────────┬───────────────────────┤
│   Parent     │   Current    │   Child/Preview       │
│              │              │                       │
│   (root)     │ > 📁 home    │ 📁 user1             │
│              │   📁 usr     │ 📁 user2             │
│              │   📁 etc     │                       │
│              │   📁 var     │                       │
│              │              │                       │
├──────────────┴──────────────┴───────────────────────┤
│ Path: /home                                          │
└──────────────────────────────────────────────────────┘
```

### Interaction Design

#### Visual Indicators
- **Selection**: `>` prefix or inverted colors
- **Folders**: `/` suffix or cyan color
- **Files**: Regular text
- **Focus**: Border or different background

#### Keyboard Mapping
```typescript
const keyBindings = {
  'ArrowUp': 'navigateUp',
  'ArrowDown': 'navigateDown',
  'ArrowLeft': 'navigateLeft',
  'ArrowRight': 'navigateRight',
  'Enter': 'openItem',
  'q': 'quitApp',
  'Escape': 'exitApp',
}
```

### Color Scheme
- **Background**: Terminal default
- **Selected**: Inverted/highlighted
- **Folders**: Bold cyan
- **Files**: Default text
- **Errors**: Red
- **Path**: Green or dim

## Implementation Phases

## Week 1: Single Column File Browser MVP

### Phase 0: OpenTUI Foundation (Day 1) ✅
**Goal: Understand OpenTUI and create working skeleton**
- [x] Initialize TypeScript project with Bun
- [x] Install and configure OpenTUI
- [x] Create "Hello World" TUI app that renders text
- [x] Implement basic keyboard input (q to quit)
- [x] Test rendering and confirm OpenTUI works
- [x] Create basic app structure with main loop
- [ ] Set up file structure for MVP

### Phase 1: File System Integration (Day 2) ✅
**Goal: Read and display files from current directory**
- [x] Create simple FileSystem module
  - [x] List directory contents (fs.readdir)
  - [x] Distinguish files from folders (fs.stat)
  - [x] Sort items (folders first, then files)
- [x] Display file list in terminal (no interaction yet)
- [x] Add basic error handling for permissions
- [ ] Start in current working directory (process.cwd())

### Phase 2: Single Column Navigation (Day 3) ✅
**Goal: Navigate up/down in a single column**
- [x] Implement keyboard navigation
  - [x] Up/down arrows to move selection
  - [x] Track selected index in state
  - [x] Handle bounds (top/bottom of list)
- [x] Visual selection indicator (> or highlight)
- [x] Display current path at bottom

### Phase 2.5: Critical Fix - Viewport Scrolling (URGENT)
**Goal: Fix viewport overflow issue discovered in testing**
- [ ] Calculate visible area (container height - borders - status bar)
- [ ] Implement viewport window (only render visible items)
- [ ] Add scroll offset tracking
- [ ] Ensure selected item auto-scrolls into view
- [ ] Add scroll indicators (e.g., "↑ 5 more" / "↓ 10 more")
- [ ] Test with directories containing 50+ files

### Phase 3: Folder Navigation (Day 4)
**Goal: Enter folders and navigate back**
- [ ] Right arrow to enter selected folder
- [ ] Left arrow to go back to parent
- [ ] Update file list when changing directories
- [ ] Maintain selection history per folder
- [ ] Handle root directory edge case

### Phase 4: File Opening (Day 5)
**Goal: Open files with system command**
- [ ] Detect operating system (macOS vs Linux)
- [ ] Right arrow on file executes open/xdg-open
- [ ] Display errors in status line
- [ ] Clear errors on next action
- [ ] Add Enter as alternative to right arrow

## Week 2: Miller Columns Enhancement

### Phase 5: Three-Column Layout (Day 6-7)
**Goal: Implement fixed 3-column miller layout**
- [ ] Create 3-column layout structure
- [ ] Column 1: Parent directory (gray if at root)
- [ ] Column 2: Current directory (always focused)
- [ ] Column 3: Child contents or file preview
- [ ] Equal width columns (terminal_width / 3)
- [ ] Update all columns on navigation

### Phase 6: Column Navigation Logic (Day 8-9)
**Goal: Implement proper miller column behavior**
- [ ] Right arrow: Move focus "into" selection
  - [ ] If folder: Current becomes parent, selected becomes current
  - [ ] If file: Open file with system command
- [ ] Left arrow: Move focus back
  - [ ] Parent becomes current, grandparent becomes parent
- [ ] Column 3 updates based on current selection
- [ ] Show icons: 📁 for folders, 📄 for files
- [ ] Handle root directory (show "(root)" in gray)
- [ ] Truncate long filenames with `...`
- [ ] Each column exactly 1/3 terminal width

### Phase 7: Polish & Edge Cases (Day 10)
**Goal: Handle edge cases and improve UX**
- [ ] Handle very long filenames (truncate)
- [ ] Handle empty directories
- [ ] Handle permission denied gracefully
- [ ] Add ... indicator for truncated names
- [ ] Ensure 'q' works from any state

### Phase 8: Optimization (Day 11-12)
**Goal: Performance and final touches**
- [ ] Optimize rendering for large directories
- [ ] Add basic scrolling for long lists
- [ ] Terminal resize handling
- [ ] Create distributable binary
- [ ] Write basic usage documentation

## File Structure

### Week 1: MVP Structure
```
miller-browser/
├── src/
│   ├── index.ts           # Entry point
│   ├── app.ts             # Main application loop
│   ├── fileSystem.ts      # File operations
│   ├── keyboard.ts        # Keyboard handling
│   ├── renderer.ts        # Screen rendering
│   ├── state.ts          # State management
│   └── types.ts          # Type definitions
├── package.json
├── tsconfig.json
├── requirements.md
├── plan.md
└── README.md
```

### Week 2: Expanded Structure
```
miller-browser/
├── src/
│   ├── index.ts           # Entry point
│   ├── app.ts             # Main application
│   ├── core/
│   │   ├── fileSystem.ts  # File operations
│   │   ├── commandExecutor.ts # Open files
│   │   └── state.ts       # State management
│   ├── components/
│   │   ├── column.ts      # Single column component
│   │   ├── columnManager.ts # Multi-column layout
│   │   └── statusBar.ts   # Status/error display
│   ├── input/
│   │   └── keyboard.ts    # Keyboard handling
│   └── types/
│       └── index.ts       # Type definitions
├── package.json
├── tsconfig.json
├── requirements.md
├── plan.md
└── README.md
```

## Technology Decisions

### Core Technologies
- **Language**: TypeScript (type safety, better IDE support)
- **UI Framework**: OpenTUI Core (no framework wrapper initially)
- **Runtime**: Bun (faster, built-in TypeScript)
- **Build**: Native TypeScript compiler

### Key Libraries
```json
{
  "dependencies": {
    "@opentui/core": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "^5.0.0"
  }
}
```

### Design Patterns
- **MVC Pattern**: Separate concerns
- **Observer Pattern**: Event handling
- **Command Pattern**: User actions
- **State Pattern**: Navigation states

## Testing Strategy

### Unit Tests
- FileSystem operations
- Navigation logic
- State management

### Integration Tests
- Column interactions
- Keyboard navigation
- Command execution

### Manual Testing
- Unix terminal emulators (Terminal.app, iTerm2, gnome-terminal, etc.)
- Various file structures
- Edge cases (empty dirs, permissions)
- Test on macOS, Ubuntu, and WSL

## Performance Considerations

### Optimization Areas
1. **Large Directories**: Virtual scrolling
2. **Deep Navigation**: Column recycling
3. **File Operations**: Async/caching
4. **Rendering**: Batch updates

### Performance Targets
- Navigation response: <50ms
- Directory load: <200ms
- Render update: <16ms (60fps)

## Risk Mitigation

### Week 1 Risks
1. **OpenTUI Learning Curve**
   - Mitigation: Start with hello world, progress incrementally
   - Fallback: Use raw ANSI codes if needed

2. **File System Permissions**
   - Mitigation: Graceful error handling from day 1
   - Test with various permission scenarios

### Week 2 Risks
1. **Fixed 3-Column Layout**
   - Mitigation: Calculate column widths early (terminal_width / 3)
   - Handle narrow terminals gracefully (minimum width)

2. **State Synchronization**
   - Mitigation: Clear state model for 3 columns
   - Always update all columns together

3. **Performance with Many Files**
   - Mitigation: Implement simple scrolling per column
   - Test with large directories (1000+ files)

4. **Terminal Compatibility**
   - Mitigation: Test on multiple terminals early
   - Use standard ANSI escape codes

## Success Metrics

### Week 1 MVP Success Criteria
- [ ] Application starts and displays files
- [ ] Can navigate with arrow keys
- [ ] Can enter/exit folders
- [ ] Can open files with system command
- [ ] 'q' key quits reliably
- [ ] Runs on macOS and Linux

### Week 2 Enhancement Success Criteria
- [ ] Fixed 3-column layout displays correctly
- [ ] Parent-Current-Child relationship clear
- [ ] Navigation updates all 3 columns properly
- [ ] File selection shows icon in column 3
- [ ] Handles 100+ files per directory
- [ ] Response time <100ms
- [ ] No crashes in normal use