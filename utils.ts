export interface ChatHistoryDTO {
    id: string;
    author: string;
    text: string;
    time: number;
}

export const generateId = (chatHistory: ChatHistoryDTO[]) => {
    return (Number(chatHistory.at(-1)?.id) + 1).toString() ?? "0";
};
