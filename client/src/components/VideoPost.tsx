import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  DollarSign,
  Send,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  likePost,
  addComment,
  followAuthor,
  toggleFavoriteAsync,
  Post,
} from "@/store/slices/postsSlice";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type VideoPostProps = {
  post: Post;
};

export function VideoPost({ post }: VideoPostProps) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    dispatch(likePost({ postId: post.id, userId: user.id }));
  };

  const handleFollow = () => {
    if (!user) {
      toast.error("Please login to follow users");
      return;
    }

    dispatch(followAuthor({ postId: post.id, follow: !post.followed }));
    toast.success(
      post.followed
        ? `Unfollowed ${post.author.name}`
        : `Following ${post.author.name}`
    );
  };

  const handleHire = () => {
    if (!user) {
      toast.error("Please login to hire tutors");
      return;
    }

    navigate(`/hire/${post.author.id}`);
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    dispatch(toggleFavoriteAsync(post.author.id));
    toast.success(
      post.author.favorite
        ? `Removed ${post.author.name} from favorites`
        : `Added ${post.author.name} to favorites`
    );
  };

  const navigateToProfile = () => {
    navigate(`/user/${post.author.id}`);
  };

  const handleShareURL = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleShareSocial = (platform: string) => {
    const url = encodeURIComponent(`${window.location.origin}/post/${post.id}`);
    const text = encodeURIComponent(`Check out this tutorial: ${post.title}`);

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  const handleSubmitComment = () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      postId: post.id,
      author: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        isTutor: user.isTutor,
      },
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    dispatch(addComment(newComment));
    setCommentText("");
    setShowComments(true);
    toast.success("Comment added successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden shadow-sm border">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={`/user/${post?.author?.id}`}>
                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage
                    src={post?.author?.avatarUrl}
                    alt={post?.author?.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post?.author?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  to={`/user/${post?.author?.id}`}
                  className="hover:underline"
                >
                  <h3 className="font-medium text-sm">{post?.author?.name}</h3>
                </Link>
                <p className="text-xs text-muted-foreground">
                  {post?.author?.isTutor ? "Tutor" : "Learner"}
                  {post?.author?.isTutor &&
                    post?.author?.hourlyRate &&
                    ` • $${post?.author?.hourlyRate}/hr`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 ${
                  post?.author?.favorite ? "text-yellow-500" : ""
                }`}
                onClick={handleFavorite}
                title={
                  post?.author?.favorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Star
                  className={`h-5 w-5 ${
                    post?.author?.favorite ? "fill-yellow-500" : ""
                  }`}
                />
              </Button>

              <Button
                size="sm"
                variant={post?.followed ? "default" : "outline"}
                className="h-8 px-3 rounded-full"
                onClick={handleFollow}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {post?.followed ? "Following" : "Follow"}
              </Button>

              {post?.author?.isTutor && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 rounded-full bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                  onClick={handleHire}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Hire
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <h2 className="text-base font-medium">{post?.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {post?.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="relative rounded-lg overflow-hidden aspect-video bg-muted">
            {isPlaying ? (
              <video
                src={post?.videoUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay
                onEnded={() => setIsPlaying(false)}
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={post?.thumbnailUrl}
                  alt={post?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-16 w-16 rounded-full bg-background/80 text-primary hover:bg-background/90 hover:scale-105 transition-all"
                    onClick={() => setIsPlaying(true)}
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </motion.svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex-col">
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center space-x-1 h-9"
                onClick={handleLike}
              >
                <Heart
                  className={`h-5 w-5 ${
                    post?.liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{post?.likes}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="flex items-center space-x-1 h-9"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-5 w-5" />
                <span>{post?.comments.length}</span>
                {showComments ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="ghost" className="h-9">
                  <Share2 className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="grid gap-2">
                  <h4 className="font-medium text-sm">Share</h4>
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleShareSocial("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleShareSocial("facebook")}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleShareSocial("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={handleShareURL}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mt-1">
                        Share via Email
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share via Email</DialogTitle>
                        <DialogDescription>
                          Send this video to someone via email
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="recipient"
                            className="text-sm font-medium"
                          >
                            Recipient Email
                          </label>
                          <Input
                            id="recipient"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="message"
                            className="text-sm font-medium"
                          >
                            Message (optional)
                          </label>
                          <Textarea
                            id="message"
                            placeholder="Check out this video!"
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                      <DialogFooter className="sm:justify-between">
                        <DialogClose asChild>
                          <Button variant="outline" className="h-8">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          className="h-8"
                          onClick={() =>
                            toast.success("Video shared via email")
                          }
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-2 space-y-4"
            >
              <div className="border-t pt-3">
                <h3 className="font-medium text-sm mb-2">
                  Comments ({post?.comments.length})
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {post?.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment?.author?.avatarUrl}
                          alt={comment?.author?.name}
                        />
                        <AvatarFallback className="text-xs">
                          {comment?.author?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted p-2 rounded-md">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-xs">
                              {comment?.author?.name}
                              {comment?.author?.isTutor && (
                                <span className="text-primary ml-1">
                                  • Tutor
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                comment?.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment?.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {post?.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>

                {user && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback className="text-xs">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-center space-x-2">
                      <Input
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="h-9"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitComment();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-9"
                        onClick={handleSubmitComment}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
