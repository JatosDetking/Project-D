export interface Comment {
    id: number;
    content: string;
    user_id: number;
    edit_date: string;
    subComment: Comment[];
}