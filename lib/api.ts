const API_BASE_URL = 'https://toolkit.rork.com';

export type ContentPart =
  | { type: 'text'; text: string; }
  | { type: 'image'; image: string; }; // base64

export type CoreMessage =
  | { role: 'system'; content: string; }
  | { role: 'user'; content: string | Array<ContentPart>; }
  | { role: 'assistant'; content: string | Array<ContentPart>; };

export type ImageGenerateRequest = { 
  prompt: string; 
  size?: string; 
};

export type ImageGenerateResponse = { 
  image: { 
    base64Data: string; 
    mimeType: string; 
  }; 
  size: string; 
};

export type STTRequest = { 
  audio: File; 
  language?: string; 
};

export type STTResponse = { 
  text: string; 
  language: string; 
};

export const api = {
  async generateText(messages: CoreMessage[]): Promise<{ completion: string }> {
    const response = await fetch(`${API_BASE_URL}/text/llm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  },

  async generateImage(request: ImageGenerateRequest): Promise<ImageGenerateResponse> {
    const response = await fetch(`${API_BASE_URL}/images/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }

    return response.json();
  },

  async transcribeAudio(formData: FormData): Promise<STTResponse> {
    const response = await fetch(`${API_BASE_URL}/stt/transcribe/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Speech-to-text failed: ${response.statusText}`);
    }

    return response.json();
  },
};