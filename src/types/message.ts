export interface MessageContentDto {
  type: 'text' | 'image_url';
  text?: string;
  imageUrl?: string;
  detail?: 'auto' | 'low' | 'high';
}

export interface MessageDto {
  threadId: string;
  type: 'human';
  content: MessageContentDto[];
}

export interface Message {
  id: string;
  type: 'human' | 'ai' | 'tool';
  content: MessageContentDto[];
}
