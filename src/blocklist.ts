import fs from 'fs';
import path from 'path';
import { config } from './config.js';

export class BlocklistManager {
  private blocklist: Set<string> = new Set();
  private blocklistPath: string;

  constructor() {
    this.blocklistPath = path.resolve(config.blocklistPath);
    this.loadBlocklist();
  }

  private loadBlocklist(): void {
    try {
      if (fs.existsSync(this.blocklistPath)) {
        const content = fs.readFileSync(this.blocklistPath, 'utf-8');
        const addresses = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.startsWith('#'));
        
        this.blocklist = new Set(addresses);
        console.log(`Loaded ${this.blocklist.size} addresses from blocklist`);
      } else {
        console.log('Blocklist file not found, creating empty blocklist');
        // Create empty blocklist file
        fs.writeFileSync(this.blocklistPath, '# Add wallet addresses to blocklist, one per line\n');
      }
    } catch (error) {
      console.error('Error loading blocklist:', error);
      this.blocklist = new Set();
    }
  }

  public isBlocked(address: string): boolean {
    return this.blocklist.has(address);
  }

  public addToBlocklist(address: string): void {
    this.blocklist.add(address);
    this.saveBlocklist();
  }

  public removeFromBlocklist(address: string): void {
    this.blocklist.delete(address);
    this.saveBlocklist();
  }

  private saveBlocklist(): void {
    try {
      const content = Array.from(this.blocklist).join('\n');
      fs.writeFileSync(this.blocklistPath, content);
    } catch (error) {
      console.error('Error saving blocklist:', error);
    }
  }

  public reload(): void {
    this.loadBlocklist();
  }
}
