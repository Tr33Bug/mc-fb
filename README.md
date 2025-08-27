# Miller Column File Browser

A minimal terminal-based file browser with Miller column navigation, built using the OpenTUI framework.

## Features

- **Miller Columns**: Fixed 3-column layout showing parent, current, and child directories
- **Keyboard Navigation**: Navigate with arrow keys, open files with system default application
- **Unix-native**: Runs on macOS, Linux, and WSL
- **Minimal Design**: Clean, focused interface for efficient file browsing

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd opentui-test

# Install dependencies
bun install
```

## Usage

```bash
# Run the file browser
bun run src/index.ts

# Or use the test script
./test.sh
```

### Keyboard Controls

- **↑/↓**: Navigate up/down in current column
- **Page Up/Page Down**: Navigate by page
- **Home/End**: Jump to first/last item
- **←**: Move to parent directory
- **→**: Enter folder or open file
- **q**: Quit application
- **ESC**: Exit application

## Development

### Project Structure

```
opentui-test/
├── src/           # Source code
├── project_log/   # Development logs
├── requirements.md # Detailed requirements
├── plan.md        # Implementation plan
└── README.md      # This file
```

### Build & Run

```bash
# Development
bun run src/index.ts

# Type checking
bun run typecheck
```

## Requirements

- Bun runtime (v1.0+)
- Unix-based terminal (macOS, Linux, WSL)
- Terminal with UTF-8 support

## License

MIT

---

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.