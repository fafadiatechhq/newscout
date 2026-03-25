export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  replies: Comment[];
  showReplies: boolean;
  showReplyInput: boolean;
}
