// configManager.ts

import fse from 'fs-extra';
import path from 'path';

const baseDir = path.join(
  path.resolve(process.env.HOME || process.env.USERPROFILE || '~/'),
  '.config'
);

interface Config {
  [key: string]: any;
}

class ConfigManager {
  // private project: string;
  private configPath: string;

  constructor(project: string, defaultConfig: Config = {}) {
    // this.project = project;
    this.configPath = path.join(baseDir, project, 'config.json');

    // Ensure the directory exists
    fse.ensureDirSync(path.join(baseDir, project));

    // If config file doesn't exist, set default config
    if (!fse.existsSync(this.configPath)) {
      fse.writeJsonSync(this.configPath, defaultConfig);
    }
  }

  // Read config
  readConfig(): Config {
    return fse.readJsonSync(this.configPath);
  }

  // Update config
  updateConfig(data: Config): void {
    const currentConfig = this.readConfig();
    const mergedConfig = {
      ...currentConfig,
      ...data,
    };
    fse.writeJsonSync(this.configPath, mergedConfig);
  }

  // setItem
  setItem(key: string, value: any): void {
    const currentConfig = this.readConfig();
    const mergedConfig = {
      ...currentConfig,
      [key]: value,
    };
    fse.writeJsonSync(this.configPath, mergedConfig);
  }

  // Get value for a specific key
  getItem(key: string): any {
    const currentConfig = this.readConfig();
    return currentConfig[key];
  }

  // Delete a specific key from the config
  deleteConfigKey(key: string): void {
    const currentConfig = this.readConfig();
    delete currentConfig[key];
    fse.writeJsonSync(this.configPath, currentConfig);
  }

  // Clear all configuration (use with caution!)
  clearConfig(): void {
    fse.writeJsonSync(this.configPath, {});
  }
}

export default ConfigManager;
