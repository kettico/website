export type Message = {
    id: string,
    sender: string,
    content: string;
    timestamp?: string,
    roomID?: string;
}