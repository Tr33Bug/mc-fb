export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modified?: Date;
}

export interface SimpleState {
  currentPath: string;
  items: FileItem[];
  selectedIndex: number;
  scrollOffset: number;
  error: string | null;
  history: string[];
}