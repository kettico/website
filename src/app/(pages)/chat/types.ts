export type Message = {
  id: number;
  sender: string;
  createdAt: string;
  content: string;
};

export type Room = {
  id: number;
  name: string;
  messages: Message[];
};
