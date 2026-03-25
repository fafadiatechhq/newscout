import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "@/types/comment-types";
import { dummyComments } from "@/utils/comment-mock-data";

const TEXT_COLLAPSE_LENGTH = 200;
const INITIAL_VISIBLE = 3;
const CommentItem = ({
  comment,
  onLike,
  onDislike,
  onToggleReplies,
  onToggleReplyInput,
  onAddReply,
  isReply = false,
}: {
  comment: Comment;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onToggleReplies: (id: string) => void;
  onToggleReplyInput: (id: string) => void;
  onAddReply: (parentId: string, text: string) => void;
  isReply?: boolean;
}) => {
  const [replyText, setReplyText] = useState("");
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const isLongText = comment.text.length > TEXT_COLLAPSE_LENGTH;

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText("");
  };

  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-3" : ""}`}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
          {comment.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {comment.author}
          </span>
          <span className="text-xs text-muted-foreground">{comment.time}</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          {isLongText && !isTextExpanded
            ? comment.text.slice(0, TEXT_COLLAPSE_LENGTH) + "…"
            : comment.text}
          {isLongText && (
            <button
              onClick={() => setIsTextExpanded(!isTextExpanded)}
              className="ml-1 inline text-xs font-medium text-primary hover:underline"
            >
              {isTextExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 gap-1 px-2 text-xs ${comment.liked ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onLike(comment.id)}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {comment.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 gap-1 px-2 text-xs ${comment.disliked ? "text-destructive" : "text-muted-foreground"}`}
            onClick={() => onDislike(comment.id)}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {comment.dislikes}
          </Button>
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={() => onToggleReplyInput(comment.id)}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Reply
            </Button>
          )}
          {!isReply && comment.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={() => onToggleReplies(comment.id)}
            >
              {comment.showReplies ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </Button>
          )}
        </div>

        {comment.showReplyInput && !isReply && (
          <div className="mt-2 flex gap-2">
            <Textarea
              placeholder="Write a reply…"
              className="min-h-[60px] text-sm"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button
              size="sm"
              className="h-10 w-11 shrink-0"
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        {comment.showReplies &&
          comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onDislike={onDislike}
              onToggleReplies={onToggleReplies}
              onToggleReplyInput={onToggleReplyInput}
              onAddReply={onAddReply}
              isReply
            />
          ))}
      </div>
    </div>
  );
};

const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const updateComment = (list: Comment[], id: string, updater: (c: Comment) => Comment): Comment[] =>
    list.map((c) => (c.id === id ? updater(c) : { ...c, replies: updateComment(c.replies, id, updater) }));

  const handleLike = (id: string) => {
    setComments((prev) =>
      updateComment(prev, id, (c) => ({
        ...c,
        liked: !c.liked,
        likes: c.liked ? c.likes - 1 : c.likes + 1,
        disliked: false,
        dislikes: c.disliked ? c.dislikes - 1 : c.dislikes,
      }))
    );
  };

const handleDislike = (id: string) => {
    setComments((prev) =>
      updateComment(prev, id, (c) => ({
        ...c,
        disliked: !c.disliked,
        dislikes: c.disliked ? c.dislikes - 1 : c.dislikes + 1,
        liked: false,
        likes: c.liked ? c.likes - 1 : c.likes,
      }))
    );
  };

const toggleReplies = (id: string) => {
    setComments((prev) => updateComment(prev, id, (c) => ({ ...c, showReplies: !c.showReplies })));
  };

const toggleReplyInput = (id: string) => {
    setComments((prev) => updateComment(prev, id, (c) => ({ ...c, showReplyInput: !c.showReplyInput })));
  };

const addReply = (parentId: string, text: string) => {
    setComments((prev) =>
      updateComment(prev, parentId, (c) => ({
        ...c,
        showReplyInput: false,
        showReplies: true,
        replies: [
          ...c.replies,
          {
            id: `r-${Date.now()}`,
            author: "You",
            avatar: "YO",
            text,
            time: "Just now",
            likes: 0,
            dislikes: 0,
            liked: false,
            disliked: false,
            replies: [],
            showReplies: false,
            showReplyInput: false,
          },
        ],
      }))
    );
    toast({ title: "Reply posted!" });
  };
  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: "You",
        avatar: "YO",
        text: newComment.trim(),
        time: "Just now",
        likes: 0,
        dislikes: 0,
        liked: false,
        disliked: false,
        replies: [],
        showReplies: false,
        showReplyInput: false,
      },
      ...prev,
    ]);
    setNewComment("");
    toast({ title: "Comment posted!" });
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
  const visibleComments = showAll ? comments : comments.slice(0, INITIAL_VISIBLE);
  const hiddenCount = comments.length - INITIAL_VISIBLE;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex w-full items-center gap-2 text-left font-serif text-xl font-bold text-foreground transition-colors hover:text-primary"
      >
        <MessageCircle className="h-5 w-5" />
        Comments ({totalCount})
        <ChevronRight className={`ml-auto h-5 w-5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>

      {!isOpen ? null : <>
      <h2 className="sr-only">
        Comments ({totalCount})
      </h2>

      {/* New comment input */}
      <div className="mb-8 flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">YO</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2">
          <Textarea
            placeholder="Add a comment…"
            className="min-h-[80px] text-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button size="sm" className="gap-2" onClick={addComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {visibleComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDislike={handleDislike}
            onToggleReplies={toggleReplies}
            onToggleReplyInput={toggleReplyInput}
            onAddReply={addReply}
          />
        ))}
      </div>

      {/* Show more / Show less button */}
      {comments.length > INITIAL_VISIBLE && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less comments
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {hiddenCount} more {hiddenCount === 1 ? "comment" : "comments"}
              </>
            )}
          </Button>
        </div>
      )}
      </>}
    </section>
  );
};

export default CommentSection;