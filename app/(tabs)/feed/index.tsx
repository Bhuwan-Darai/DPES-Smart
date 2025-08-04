import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import TopBar from "@/components/TopBar";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import { useQuery, gql, useMutation } from "@apollo/client";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { Picker } from "@react-native-picker/picker";
import {
  CREATE_NEWSFEED_COMMENT,
  CREATE_QUESTION_RESPONSE,
  GET_ALL_NEWSFEED,
  GET_NEWSFEED_COMMENTS,
  LIKE_NEWSFEED,
} from "@/lib/hooks/graphql/queries";
import NewsFeedImageSlider from "@/components/ui/NewsFeedSlider";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";

const GET_ALL_NEWSFEED_CATEGORIES = gql`
  query GetAllNewsFeedCategories {
    getAllNewsFeedCategories {
      newsFeedCategoryId
      categoryName
    }
  }
`;

interface Option {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  questionId: string;
  questionText: string;
  questionSolution?: string | null;
  questionImage?: {
    imageId: string;
    imageUrl: string;
    altText: string;
    file: string;
  }[];
  options: Option[];
}

interface Comment {
  commentId: string;
  content: string;
  authorName: string;
  authorImage?: string;
  authorId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked?: boolean; // Optional, as not provided in schema
  replies?: Comment[];
}

interface NewsFeed {
  newsFeedId: string;
  newsTitle: string;
  newsContent: string;
  newsDate: string;
  scheduleDate?: string | null;
  scheduleTime?: string;
  priority: string;
  isVisible: boolean;
  linkUrls?: string[];
  isLiked: boolean;
  selectedOption?: string;
  comments: number; // Adjusted to match newsfeeds data
  likes: number;
  shares: number;
  newsFeedCategoryId?: string;
  imageFiles?: { fileimageUrl: string; file: string }[];
  question?: Question[];
  authorName: string;
}

interface Category {
  newsFeedCategoryId: string;
  categoryName: string;
}

export default function FeedScreen() {
  const { userDetails, isAuthenticated } = useAuth();
  console.log("userDetails", userDetails);

  // Don't render or execute queries if not authenticated
  if (!isAuthenticated || !userDetails) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.centerContent}>
          <Text style={styles.authMessage}>Please log in to view the feed</Text>
        </View>
      </View>
    );
  }

  const [selectedAnswer, setSelectedAnswer] = useState<{
    [key: string]: number | null;
  }>({});
  const [showAnswer, setShowAnswer] = useState<{ [key: string]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [commentParentId, setCommentParentId] = useState<string | null>(null);
  const [replying, setReplying] = useState<boolean>(false);

  // Fetch news feed - only execute when authenticated
  const {
    data: newsFeedData,
    loading: newsFeedLoading,
    error: newsFeedError,
    refetch: refetchNewsfeed,
  } = useQuery(GET_ALL_NEWSFEED, {
    variables: {
      page: 1,
      limit: 10,
    },
    skip: !isAuthenticated, // Skip query if not authenticated
  });

  // Fetch news feed comments - only execute when authenticated
  const {
    data: newsFeedCommentsData,
    loading: newsFeedCommentsLoading,
    error: newsFeedCommentsError,
    refetch: refetchNewsFeedComments,
  } = useQuery(GET_NEWSFEED_COMMENTS, {
    variables: {
      postId: selectedPost,
    },
    skip: !selectedPost || !isAuthenticated, // Skip query if not authenticated
  });

  console.table(newsFeedData?.getPaginatedNewsFeedMobile?.newsfeeds);

  // Fetch categories - only execute when authenticated
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_ALL_NEWSFEED_CATEGORIES,
    {
      skip: !isAuthenticated, // Skip query if not authenticated
    }
  );

  // like newsfeed
  const [likeNewsfeed] = useMutation(LIKE_NEWSFEED, {
    onCompleted: (data) => {
      Toast.show({
        type: "success",
        text1: data.likeNewsfeed.message,
      });
      refetchNewsfeed();
      refetchNewsFeedComments();
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  // create comment
  const [createNewsfeedComment] = useMutation(CREATE_NEWSFEED_COMMENT, {
    onCompleted: (data) => {
      Toast.show({
        type: "success",
        text1: data.createNewsfeedComment.message,
      });
      refetchNewsfeed();
      refetchNewsFeedComments();
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  const handleSubmitComment = () => {
    createNewsfeedComment({
      variables: {
        input: JSON.stringify({
          postId: selectedPost,
          content: newComment,
          authorId: userDetails?.id,
          parentId: replying ? commentParentId : "",
        }),
      },
    });
    setNewComment("");
    setModalVisible(false);
  };

  // create question response mutation
  const [createQuestionResponse] = useMutation(CREATE_QUESTION_RESPONSE, {
    onCompleted: (data) => {
      Toast.show({
        type: "success",
        text1: data.createQuestionResponse.message,
      });
      refetchNewsfeed();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to submit answer",
      });
    },
  });

  const handleAnswerSubmit = async (
    questionId: string,
    optionId: string,
    isCorrect: boolean
  ) => {
    console.log("questionId", questionId);
    console.log("optionId", optionId);
    console.log("isCorrect", isCorrect);

    console.log("sending the data to backend");

    // Send to backend
    createQuestionResponse({
      variables: {
        input: JSON.stringify({
          questionId: questionId,
          response: optionId,
          authorId: userDetails?.id,
          isCorrect: isCorrect,
        }),
      },
    });
  };

  if (newsFeedLoading || categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading news feed...</Text>
      </View>
    );
  }

  if (newsFeedError) {
    console.error("GraphQL Error:", newsFeedError);
    return <ErrorScreen onRetry={refetchNewsfeed} />;
  }

  const newsfeeds: NewsFeed[] =
    newsFeedData?.getPaginatedNewsFeedMobile?.newsfeeds || [];

  // Process comments to combine parent and child comments
  const comments: Comment[] =
    newsFeedCommentsData?.getNewsFeedComments?.data?.parentComments?.map(
      (parent: Comment) => ({
        ...parent,
        replies:
          newsFeedCommentsData?.getNewsFeedComments?.data?.childComments?.filter(
            (child: Comment) => child.parentId === parent.commentId
          ) || [],
      })
    ) || [];

  const handleAnswerSelect = (
    newsFeedId: string,
    optionId: string,
    isCorrect: boolean,
    optionIndex: number,
    questionId: string
  ) => {
    setSelectedAnswer((prev) => ({ ...prev, [newsFeedId]: optionIndex }));
    setShowAnswer((prev) => ({ ...prev, [newsFeedId]: true }));
    handleAnswerSubmit(questionId, optionId, isCorrect);
  };

  const renderPost = (post: NewsFeed) => {
    const postType: "text" | "image" | "link" | "mcq" =
      post.question &&
      post.question.length > 0 &&
      post.question[0].options.length > 0
        ? "mcq"
        : post.imageFiles?.length
        ? "image"
        : post.linkUrls?.length
        ? "link"
        : "text";

    // handle like newsfeed
    const handleLike = (newsFeedId: string) => {
      console.log("newsFeedId", newsFeedId);
      likeNewsfeed({
        variables: {
          input: JSON.stringify({
            postId: newsFeedId,
            authorId: userDetails?.id,
          }),
        },
      });
    };

    // handle comment newsfeed
    const handleComment = (newsFeedId: string) => {
      setSelectedPost(newsFeedId);
      setModalVisible(true);
      setReplying(false);
    };

    return (
      <View key={post.newsFeedId} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <Text style={styles.authorRole}>
                {post.priority || "General"}
              </Text>
            </View>
          </View>
          {/* <TouchableOpacity>
            <MoreHorizontal size={20} color="#666" />
          </TouchableOpacity> */}
        </View>

        <Text style={styles.postContent}>{post.newsContent}</Text>
        <View>
          {postType === "image" && post.imageFiles && (
            <NewsFeedImageSlider
              images={post.imageFiles.map((image) => image.file)}
            />
          )}
        </View>

        {postType === "link" && post.linkUrls?.[0] && (
          <TouchableOpacity style={styles.linkCard}>
            <LinkIcon size={20} color="#007AFF" />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>{post.newsTitle}</Text>
              <Text style={styles.linkDescription}>{post.linkUrls[0]}</Text>
            </View>
          </TouchableOpacity>
        )}

        {postType === "mcq" &&
          post.question &&
          post.question.map((question) => (
            <View key={question.questionId} style={styles.mcqContainer}>
              <Text style={styles.mcqQuestion}>{question.questionText}</Text>
              {question.questionImage && question.questionImage.length > 0 && (
                <View style={styles.questionImageContainer}>
                  {question.questionImage.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.file }}
                      style={styles.questionImage}
                    />
                  ))}
                </View>
              )}

              {question.options.map((option, index) => {
                const isSelected = post.selectedOption === option.optionId;
                const isCorrect = option.isCorrect;

                return (
                  <TouchableOpacity
                    key={option.optionId}
                    style={[
                      styles.mcqOption,

                      // Only apply green/red if there's a selected option
                      post.selectedOption &&
                        isSelected &&
                        isCorrect &&
                        styles.correctOption,
                      post.selectedOption &&
                        isSelected &&
                        !isCorrect &&
                        styles.incorrectOption,
                    ]}
                    onPress={() =>
                      handleAnswerSelect(
                        post.newsFeedId,
                        option.optionId,
                        option.isCorrect,
                        index,
                        question.questionId
                      )
                    }
                    disabled={showAnswer[post.newsFeedId]}
                  >
                    <Text
                      style={[
                        styles.mcqOptionText,

                        // Text coloring only if selected
                        post.selectedOption &&
                          isSelected &&
                          isCorrect &&
                          styles.correctOptionText,
                        post.selectedOption &&
                          isSelected &&
                          !isCorrect &&
                          styles.incorrectOptionText,
                      ]}
                    >
                      {option.optionText}
                    </Text>

                    {showAnswer[post.newsFeedId] &&
                      (isCorrect ? (
                        <CheckCircle size={20} color="#34C759" />
                      ) : isSelected ? (
                        <XCircle size={20} color="#FF3B30" />
                      ) : null)}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

        <View style={styles.postFooter}>
          <View style={styles.postActions}>
            <TouchableOpacity
              onPress={() => handleLike(post.newsFeedId)}
              style={styles.actionButton}
            >
              <Heart size={20} color={post.isLiked ? "#FF3B30" : "#666"} />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleComment(post.newsFeedId)}
              style={styles.actionButton}
            >
              <MessageCircle size={20} color="#666" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#666" />
              <Text style={styles.actionText}>{post.shares}</Text>
            </TouchableOpacity> */}
          </View>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={20} color="#666" />
          </TouchableOpacity> */}
        </View>

        <Text style={styles.timestamp}>
          {new Date(post.newsDate).toLocaleString()}
        </Text>
      </View>
    );
  };

  const handleReply = (commentId: string) => {
    console.log("commentId", commentId);
    setCommentParentId(commentId);
    setReplying(true);
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <View style={styles.createPost}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
            }}
            style={styles.userAvatar}
          />
          <TouchableOpacity style={styles.postInput}>
            <Text style={styles.postInputText}>What's on your mind?</Text>
          </TouchableOpacity>
        </View>
        {newsfeeds.length > 0 ? (
          newsfeeds.map((post) => renderPost(post))
        ) : (
          <Text style={styles.noPostsText}>No posts available</Text>
        )}
      </ScrollView>

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Comments</Text>
              </View>

              <View style={styles.commentsContainer}>
                {newsFeedCommentsLoading ? (
                  <ActivityIndicator size="large" color="#007AFF" />
                ) : newsFeedCommentsError ? (
                  <ErrorScreen onRetry={refetchNewsFeedComments} />
                ) : comments.length > 0 ? (
                  <ScrollView style={styles.commentsList}>
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.commentId}
                        comment={comment}
                        onLike={(id) => {
                          console.log("Like comment:", id);
                        }}
                        onReply={() => handleReply(comment.commentId)}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.noCommentsText}>
                    No comments available
                  </Text>
                )}
              </View>

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder={
                    replying ? "Write a reply..." : "Write a comment..."
                  }
                  multiline
                  value={newComment}
                  onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity
                  onPress={handleSubmitComment}
                  style={styles.commentSubmitButton}
                >
                  <Text style={styles.commentSubmitText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const CommentItem = ({
  comment,
  onLike,
  onReply,
}: {
  comment: Comment;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
}) => {
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.authorName}</Text>
        <Text style={styles.commentTimestamp}>
          {new Date(comment.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.commentText}>{comment.content}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.commentActionButton}
          onPress={() => onLike(comment.commentId)}
        >
          <Heart size={16} color={comment.isLiked ? "#FF3B30" : "#666"} />
          <Text
            style={[
              styles.commentActionText,
              comment.isLiked && styles.likedActionText,
            ]}
          >
            {comment.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentActionButton}
          onPress={() => onReply(comment.commentId)}
        >
          <MessageCircle size={16} color="#666" />
          <Text style={styles.commentActionText}>Reply</Text>
        </TouchableOpacity>
      </View>
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
  noPostsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  noCommentsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  createPost: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    padding: 12,
  },
  postInputText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#000",
  },
  authorRole: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkCard: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  linkContent: {
    flex: 1,
    marginLeft: 12,
  },
  linkTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  linkDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
  },
  mcqContainer: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  mcqQuestion: {
    fontFamily: "Inter_900Black",
    fontSize: 14,
    color: "#000",
    marginBottom: 12,
  },
  mcqOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#E5E5EA",
  },
  selectedOptionText: {
    color: "#666",
  },
  correctOption: {
    backgroundColor: "#E8F5E9",
  },
  incorrectOption: {
    backgroundColor: "#FFE8E6",
  },
  mcqOptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  correctOptionText: {
    color: "rgba(0,255,0,0.5)",
  },
  incorrectOptionText: {
    color: "rgba(255,0,0,0.5)",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  postActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: "50%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  commentsContainer: {
    flex: 1,
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  commentItem: {
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: "600",
    marginRight: 8,
  },
  commentTimestamp: {
    color: "#666",
    fontSize: 12,
  },
  commentText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentActionText: {
    color: "#666",
    marginLeft: 4,
    fontSize: 12,
  },
  likedActionText: {
    color: "#FF3B30",
  },
  repliesContainer: {
    marginLeft: 16,
    marginTop: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#E5E5EA",
    paddingLeft: 8,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  commentSubmitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentSubmitText: {
    color: "#fff",
    fontWeight: "600",
  },
  questionImageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  questionImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  authMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
});
