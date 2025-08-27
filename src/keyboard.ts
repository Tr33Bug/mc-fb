export enum KeyCode {
  UP = '\u001b[A',
  DOWN = '\u001b[B',
  LEFT = '\u001b[D',
  RIGHT = '\u001b[C',
  ENTER = '\r',
  ESC = '\u001b',
  Q = 'q',
  Q_UPPER = 'Q',
  CTRL_C = '\u0003',
  PAGE_UP = '\u001b[5~',
  PAGE_DOWN = '\u001b[6~',
  HOME = '\u001b[H',
  END = '\u001b[F',
}

export class KeyboardHandler {
  private handlers: Map<string, () => void> = new Map();

  /**
   * Register a handler for a specific key
   */
  on(key: string, handler: () => void): void {
    this.handlers.set(key, handler);
  }

  /**
   * Process incoming keyboard data
   */
  handle(data: Buffer): void {
    const key = data.toString();
    
    // Check if we have a handler for this key
    const handler = this.handlers.get(key);
    if (handler) {
      handler();
    }
  }

  /**
   * Remove a handler
   */
  off(key: string): void {
    this.handlers.delete(key);
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}