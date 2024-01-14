// types.ts

export interface Message {
  id: number;
  name: string;
  isSender?: boolean;
  content: string;
  timestamp: Date;
}
