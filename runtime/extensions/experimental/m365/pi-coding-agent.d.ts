declare module "@earendil-works/pi-coding-agent" {
	export interface ExtensionToolResult {
		content: Array<{ type: string; text: string }>;
		details?: any;
	}

	export interface ExtensionUI {
		setStatus(key: string, value: string): void;
		notify(message: string, level?: string): void;
	}

	export interface ExtensionContext {
		ui: ExtensionUI;
	}

	export interface ExtensionCommand {
		description: string;
		handler: (args: string[], ctx: ExtensionContext) => Promise<void> | void;
	}

	export interface ExtensionTool {
		name: string;
		label: string;
		description: string;
		promptSnippet?: string;
		promptGuidelines?: string[];
		parameters: any;
		execute: (id: string, params: any) => Promise<ExtensionToolResult>;
	}

	export interface ExtensionAPI {
		on(event: string, handler: (event: any, ctx: ExtensionContext) => Promise<any> | any): void;
		registerCommand(name: string, command: ExtensionCommand): void;
		registerTool(tool: ExtensionTool): void;
	}
}
