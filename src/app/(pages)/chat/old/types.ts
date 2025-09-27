export type Room = {
  id: number;
  name: string;
  messages?: Message[];
};

export type Message = {
  id: number;
  sender: string;
  content: string;
};
