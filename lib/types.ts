export interface ProjectFile {
  path: string;
  content: string;
  language: string;
  updatedAt: number;
}

export interface GitCommit {
  id: string;
  message: string;
  timestamp: number;
  filesChanged: number;
  author: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  template: string;
  files: Record<string, ProjectFile>;
  activeFilePath: string;
  createdAt: number;
  updatedAt: number;
  envVars: Record<string, string>;
  commits: GitCommit[];
}

export type ModelType = 'gemini-3.7-flash' | 'gemini-3.7-flash-fast' | 'gemini-3.1-pro-preview';

export type VibeStyle = 'builder' | 'creative' | 'surgical' | 'minimal';

export interface ToolCallData {
  id: string;
  tool: 'create_file' | 'edit_file' | 'delete_file' | 'run_command' | 'lint' | 'web_search';
  targetPath?: string;
  command?: string;
  content?: string;
  diff?: {
    added: number;
    removed: number;
    preview: string;
  };
  output?: string;
  status: 'pending' | 'success' | 'failed';
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'thinking' | 'streaming' | 'done' | 'error';
  thinking?: string;
  toolCalls?: ToolCallData[];
  modelUsed?: string;
  attachedImages?: string[];
  vibeStyle?: VibeStyle;
}

export interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'info' | 'success';
  text: string;
  timestamp: number;
}

export type Language = 'en' | 'id';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  vibeStyle: VibeStyle;
  soundEnabled: boolean;
  language?: Language;
  totalPromptsSent: number;
  totalFilesGenerated: number;
  joinedAt: number;
  lastActiveAt: number;
}

export interface ChatSyncPayload {
  projectId: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface ServerSyncResponse {
  success: boolean;
  chats: Record<string, ChatMessage[]>;
  lastSyncedAt: number;
  messageCount: number;
}
