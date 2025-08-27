import { promises as fs } from 'fs';
import * as path from 'path';
import type { FileItem } from './types';

export class FileSystem {
  /**
   * List directory contents including hidden files
   */
  async listDirectory(dirPath: string): Promise<FileItem[]> {
    try {
      const items = await fs.readdir(dirPath);
      const fileItems: FileItem[] = [];

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        try {
          const stats = await fs.stat(fullPath);
          fileItems.push({
            name: item,
            path: fullPath,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            modified: stats.mtime,
          });
        } catch (error) {
          // Handle permission errors for individual files
          console.error(`Cannot access ${fullPath}:`, error);
          fileItems.push({
            name: item,
            path: fullPath,
            isDirectory: false, // Assume file if can't stat
          });
        }
      }

      return this.sortItems(fileItems);
    } catch (error) {
      throw new Error(`Failed to read directory ${dirPath}: ${error}`);
    }
  }

  /**
   * Sort items: folders first (with 📁 icon), then files (with 📄 icon), both alphabetically
   */
  private sortItems(items: FileItem[]): FileItem[] {
    return items.sort((a, b) => {
      // Folders come first
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      
      // Then sort alphabetically (case-insensitive)
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  /**
   * Format item name with appropriate icon
   */
  formatItemName(item: FileItem): string {
    const icon = item.isDirectory ? '📁' : '📄';
    return `${icon} ${item.name}`;
  }

  /**
   * Get parent directory path
   */
  getParentPath(currentPath: string): string {
    const parent = path.dirname(currentPath);
    // Prevent going above root
    return parent === currentPath ? '/' : parent;
  }

  /**
   * Check if path is root
   */
  isRoot(currentPath: string): boolean {
    return currentPath === '/' || currentPath === path.parse(currentPath).root;
  }

  /**
   * Resolve path (handle ~, relative paths, etc.)
   */
  resolvePath(inputPath: string): string {
    if (inputPath.startsWith('~')) {
      const home = process.env.HOME || process.env.USERPROFILE || '';
      inputPath = path.join(home, inputPath.slice(1));
    }
    return path.resolve(inputPath);
  }
}