#!/bin/bash
# Test script for the TUI app
# Run this script manually to test the app

echo "Starting Miller Column File Browser test..."
echo "The app should display:"
echo "  - A bordered box"
echo "  - Title: 'Miller Column File Browser - Hello World!'"
echo "  - Instruction: 'Press q to quit'"
echo ""
echo "Press 'q' to quit the app when it starts."
echo "Press Enter to continue..."
read

bun run src/index.ts