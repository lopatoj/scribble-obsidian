import {
  App,
  Editor,
  MarkdownView,
  Hotkey,
  Plugin,
  PluginSettingTab,
  Setting,
  FileSystemAdapter,
} from "obsidian";
import { execFileSync } from "child_process";
import { promisify } from "util";

interface ScribbleSettings {
  shortcut: Hotkey;
}

const DEFAULT_SETTINGS: ScribbleSettings = {
  shortcut: { key: "b", modifiers: ["Ctrl"] },
};

export default class Scribble extends Plugin {
  settings: ScribbleSettings;

  async onload() {
    await this.loadSettings();

    const basePath = (this.app.vault.adapter as any).basePath;
		const exec = promisify(execFileSync);

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: "open-fingerpaint",
      name: "Add Touchpad Drawing",
      editorCallback: (editor: Editor, view: MarkdownView) => {
        exec('fingerpaint --title Scribble --line-color "#ffffff" --hint "" --dark -o ' + basePath + '/image.png');
        editor.setLine(editor.getCursor().line, "![](image.png)");
      },
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SettingTab extends PluginSettingTab {
  plugin: Scribble;

  constructor(app: App, plugin: Scribble) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();
  }
}
