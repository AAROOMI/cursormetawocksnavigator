// Type declarations for @google/genai package
declare module '@google/genai' {
  export interface LiveSession {
    sendRealtimeInput(input: { media: Blob }): void;
    sendToolResponse(response: { functionResponses: { id: string; name: string; response: Record<string, any> } }): void;
    close(): void;
  }

  export interface LiveServerMessage {
    serverContent?: {
      inputTranscription?: { text: string };
      outputTranscription?: { text: string };
      turnComplete?: boolean;
      interrupted?: boolean;
      modelTurn?: {
        parts?: Array<{
          inlineData?: {
            data: string;
            mimeType?: string;
          };
        }>;
      };
    };
    toolCall?: {
      functionCalls?: Array<{
        id: string;
        name: string;
        args: Record<string, any>;
      }>;
    };
  }

  export type Modality = 'audio' | 'text' | 'image';

  export const Modality: {
    AUDIO: 'audio';
    TEXT: 'text';
    IMAGE: 'image';
  };

  export interface Blob {
    data: string;
    mimeType: string;
  }

  export const Type: {
    OBJECT: string;
    STRING: string;
    NUMBER: string;
    BOOLEAN: string;
    ARRAY: string;
  };

  export interface FunctionDeclaration {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties?: Record<string, {
        type: string;
        description?: string;
      }>;
      required?: string[];
    };
  }

  export interface LiveConnectConfig {
    model: string;
    callbacks: {
      onopen?: () => void;
      onmessage?: (message: LiveServerMessage) => void;
      onerror?: (error: Error) => void;
      onclose?: () => void;
    };
    config?: {
      responseModalities?: Modality[];
      inputAudioTranscription?: Record<string, any>;
      outputAudioTranscription?: Record<string, any>;
      speechConfig?: {
        voiceConfig?: {
          prebuiltVoiceConfig?: {
            voiceName?: string;
          };
        };
      };
      systemInstruction?: string;
      tools?: Array<{ functionDeclarations: FunctionDeclaration[] }>;
      languageCodes?: string[];
    };
    systemInstruction?: string;
    tools?: Array<{ functionDeclarations: FunctionDeclaration[] }>;
  }

  export interface GenerateContentRequest {
    model: string;
    contents: string;
    config?: {
      responseMimeType?: string;
      responseSchema?: {
        type: string;
        properties?: Record<string, { type: string }>;
      };
    };
  }

  export interface GenerateContentResponse {
    text: string;
  }

  export class GoogleGenAI {
    constructor(config: { apiKey: string });
    live: {
      connect(config: LiveConnectConfig): Promise<LiveSession>;
    };
    models: {
      generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse>;
    };
  }
}

