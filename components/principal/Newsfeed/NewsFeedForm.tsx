import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import {
  Plus,
  X,
  Calendar,
  User,
  FileText,
  Link,
  Image as ImageIcon,
  Clock,
  Flag,
  Eye,
  EyeOff,
  Save,
  Send,
  ImagePlus,
  Link2,
  HelpCircle,
  Filter,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_URL } from "@/lib/constants";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_NEWSFEED,
  GET_ALL_NEWSFEED_CATEGORIES,
} from "../../../lib/hooks/graphql/PrincipalQueries";
import { GET_ALL_NEWSFEED } from "@/lib/hooks/graphql/queries";

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

interface NewsItem {
  id: string;
  newsFeedId: string;
  title: string;
  content: string;
  date: string;
  author: string;
  scheduleDate?: string | null;
  scheduleTime?: string;
  category?: string;
  imageFiles?: ImageWithTitle[];
  images: ImageWithTitle[];
  imageUrls: string[];
  links: string[];
  schedule?: string;
  priority: "high" | "medium" | "low";
  isVisible: boolean;
  question?: Question[];
}

const { width } = Dimensions.get("window");

interface ImageWithTitle {
  file?: string;
  url: string;
  title?: string;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  questionContent: string;
  questionImages: ImageWithTitle[];
  options: Option[];
  solution: string;
}

interface QuestionImagePath {
  url: string;
  title: string;
}

export interface InitialData {
  newsFeedId: string;
  newsFeedCategoryId: string;
  newsTitle: string;
  newsContent: string;
  newsDate: string;
  authorName: string;
  imageFiles: ImageWithTitle[];
  linkUrls: string[];
  scheduleDate: string;
  priority: string;
  isVisible: boolean;
  question: InitialQuestion[];
  schedule: string;
  scheduleTime: string;
  isLiked: boolean;
  selectedOption: string;
  comments: number;
  likes: number;
  shares: number;
}

interface InitialQuestion {
  questionId: string;
  questionText: string;
  questionContent: string;
  questionImage: InitialQuestionImage[];
  options: InitialOption[];
  questionSolution: string;
}

interface InitialOption {
  optionId: string;
  optionText: string;
  isCorrect: boolean;
}

interface InitialQuestionImage {
  imageId: string;
  imageUrl: string;
  altText: string;
  file: string;
}

const NewsFeedForm: React.FC<{
  initialData?: InitialData;
  onClose?: () => void;
}> = ({ initialData, onClose }) => {
  console.log("initialData", JSON.stringify(initialData, null, 2));
  const [activeTab, setActiveTab] = useState<"media" | "links" | "questions">(
    "media"
  );
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    author: "",
    category: "",
    images: [],
    imageUrls: [],
    links: [],
    schedule: "",
    priority: "medium",
    isVisible: true,
  });

  // Question state
  const [questionText, setQuestionText] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [questionImages, setQuestionImages] = useState<ImageWithTitle[]>([]);
  const [options, setOptions] = useState<Option[]>([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
  ]);
  const [solution, setSolution] = useState("");
  const [newImageTitle, setNewImageTitle] = useState("");

  // Question images upload state
  const [selectedQuestionFiles, setSelectedQuestionFiles] = useState<any[]>([]);
  const [questionFilePath, setQuestionFilePath] = useState<QuestionImagePath[]>(
    []
  );
  const [questionPresignedUrls, setQuestionPresignedUrls] = useState<string[]>(
    []
  );

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [scheduleTimeString, setScheduleTimeString] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 8); // "HH:mm:ss"
  });

  const [newLink, setNewLink] = useState("");

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedFile, setSelectedFile] = useState<any[]>([]);
  const [filePath, setFilePath] = useState<string[]>([]);
  const [presignedUrls, setPresignedUrls] = useState<string[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const { data: categoriesData, refetch: refetchCategories } = useQuery(
    GET_ALL_NEWSFEED_CATEGORIES
  );

  // mutation
  const [createNewsFeed, { loading: createNewsFeedLoading }] = useMutation(
    CREATE_NEWSFEED,
    {
      onCompleted: (data) => {
        Alert.alert(data.createNewsfeed.message);
        refetchCategories();

        setFormData({
          title: "",
          content: "",
          date: new Date().toISOString().split("T")[0],
          author: "",
          category: "",
          images: [],
          imageUrls: [],
          links: [],
          schedule: "",
          priority: "medium",
          isVisible: true,
        });
        setQuestionText("");
        setQuestionContent("");
        setQuestionImages([]);
        setOptions([
          { id: "1", text: "", isCorrect: false },
          { id: "2", text: "", isCorrect: false },
        ]);
        setSolution("");
        setScheduleDate(new Date());
        setScheduleTime(new Date());
        setScheduleTimeString(new Date().toTimeString().slice(0, 8));
        // Reset question image uploads
        setSelectedQuestionFiles([]);
        setQuestionFilePath([]);
        setQuestionPresignedUrls([]);
        // onClose();
      },
      onError: (error) => {
        Alert.alert("Something went wrong");
      },
      refetchQueries: [
        { query: GET_ALL_NEWSFEED, variables: { page: 1, limit: 10 } },
      ],
    }
  );

  useEffect(() => {
    if (categoriesData?.getAllCategories) {
      setCategories(categoriesData.getAllCategories);
      // Select the first category by default if not already set
      if (!formData.category && categoriesData.getAllCategories.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category:
            categoriesData.getAllCategories[0].categoryId ||
            categoriesData.getAllCategories[0].id,
        }));
      }
    }
  }, [categoriesData]);

  const priorities = [
    { value: "low", label: "Low", color: "#10b981" },
    { value: "medium", label: "Medium", color: "#f59e0b" },
    { value: "high", label: "High", color: "#ef4444" },
  ];

  const updateFormData = (key: keyof NewsItem, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addLink = () => {
    if (newLink.trim()) {
      updateFormData("links", [...(formData.links || []), newLink.trim()]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    const updatedLinks = formData.links?.filter((_, i) => i !== index) || [];
    updateFormData("links", updatedLinks);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      Alert.alert("Error", "Please fill in title and content");
      return;
    }
    Alert.alert("Success", "News item saved successfully!");
  };

  // Question functions
  const addOption = () => {
    setOptions([
      ...options,
      { id: Date.now().toString(), text: "", isCorrect: false },
    ]);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const updateOption = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const toggleCorrectOption = (id: string) => {
    setOptions(
      options.map((option) =>
        option.id === id
          ? { ...option, isCorrect: !option.isCorrect }
          : { ...option, isCorrect: false }
      )
    );
  };

  // set initial data
  useEffect(() => {
    if (initialData) {
      // Convert priority to proper type
      const priority = initialData.priority as "high" | "medium" | "low";

      // Convert question images to proper format
      const convertedQuestionImages: ImageWithTitle[] =
        initialData.question?.[0]?.questionImage?.map((img) => ({
          file: img.file || "", // React Native doesn't have File API, use null
          url: img.imageUrl,
          title: img.altText,
        })) || [];

      // Convert options to proper format
      let convertedOptions: Option[] =
        initialData.question?.[0]?.options?.map((opt) => ({
          id: opt.optionId,
          text: opt.optionText,
          isCorrect: opt.isCorrect,
        })) || [];

      // Ensure at least 2 options exist
      if (convertedOptions.length < 2) {
        const defaultOptions = [
          { id: "1", text: "", isCorrect: false },
          { id: "2", text: "", isCorrect: false },
        ];
        convertedOptions = [
          ...convertedOptions,
          ...defaultOptions.slice(convertedOptions.length),
        ];
      }

      // Parse schedule date and time
      let scheduleDateObj = new Date();
      if (initialData.scheduleDate) {
        try {
          scheduleDateObj = new Date(initialData.scheduleDate);
          if (isNaN(scheduleDateObj.getTime())) {
            scheduleDateObj = new Date();
          }
        } catch (error) {
          console.warn("Error parsing schedule date:", error);
          scheduleDateObj = new Date();
        }
      }

      let scheduleTimeObj = new Date();
      if (initialData.scheduleTime) {
        try {
          // Handle different time formats
          let timeString = initialData.scheduleTime || "00:00:00";
          if (timeString.includes(":")) {
            // If it's already in HH:mm:ss format
            scheduleTimeObj = new Date(`2000-01-01T${timeString}`);
          } else {
            // If it's in a different format, try to parse it
            scheduleTimeObj = new Date(initialData.scheduleTime);
          }
        } catch (error) {
          console.warn("Error parsing schedule time:", error);
          scheduleTimeObj = new Date();
        }
      }

      setFormData({
        title: initialData.newsTitle,
        content: initialData.newsContent,
        date: initialData.newsDate,
        author: initialData.authorName,
        category: initialData.newsFeedCategoryId,
        images: initialData.imageFiles,
        imageUrls: initialData.linkUrls,
        links: initialData.linkUrls,
        schedule: initialData.schedule || initialData.scheduleDate,
        priority: priority,
        isVisible: initialData.isVisible,
      });

      setQuestionText(initialData.question?.[0]?.questionText || "");
      setQuestionContent(initialData.question?.[0]?.questionContent || "");
      setQuestionImages(convertedQuestionImages);
      setOptions(convertedOptions);
      setSolution(initialData.question?.[0]?.questionSolution || "");
      setScheduleDate(scheduleDateObj);
      setScheduleTime(scheduleTimeObj);
      setScheduleTimeString(
        initialData.scheduleTime || new Date().toTimeString().slice(0, 8)
      );
      setSelectedDate(scheduleDateObj);

      // Initialize file paths and presigned URLs for existing images
      if (initialData.imageFiles && initialData.imageFiles.length > 0) {
        const imageUrls = initialData.imageFiles.map((img) => img.file || "");
        setPresignedUrls(imageUrls);
        // Extract file paths from URLs (assuming they contain the object names)
        const paths = initialData.imageFiles.map((img) => {
          // Extract the file path from the URL
          return img.url || ""; // Get the filename
        });
        setFilePath(paths);
      }

      // Initialize question image paths and presigned URLs
      if (
        initialData.question?.[0]?.questionImage &&
        initialData.question[0].questionImage.length > 0
      ) {
        const questionImageUrls = initialData.question[0].questionImage.map(
          (img) => img.file || ""
        );
        setQuestionPresignedUrls(questionImageUrls);

        const questionPaths = initialData.question[0].questionImage.map(
          (img, index) => ({
            url: img.imageUrl || "",
            title: img.altText || `question-${index}`,
          })
        );
        setQuestionFilePath(questionPaths);
      }
    }
  }, [initialData]);

  const removeQuestionImage = (index: number) => {
    setQuestionImages(questionImages.filter((_, i) => i !== index));
  };

  // handle submit Newsfeed
  const handleSubmitNewsfeed = async () => {
    const dataToSubmit = {
      newsFeedId: initialData?.newsFeedId || "",
      categoryId: formData.category,
      category: formData.category,
      title: formData.title,
      content: formData.content,
      date: formData.date,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTimeString,
      priority: formData.priority,
      isVisible: formData.isVisible,
      imageUrls: filePath,
      links: formData.links,
      questionText: questionText,
      questionContent: questionContent,
      questionImages: questionFilePath,
      options: options,
      solution: solution,
    };

    if (activeTab == "questions" && !questionText) {
      Alert.alert("Question title is required");
      return;
    }

    if (activeTab == "questions" && options.length < 2) {
      Alert.alert("At least two options are required");
      return;
    }

    if (
      activeTab == "questions" &&
      !options.some((option) => option.isCorrect)
    ) {
      Alert.alert("At least one option must be correct");
      return;
    }

    if (activeTab == "questions" && solution.trim() == "") {
      Alert.alert("Solution is required");
      return;
    }

    const stringifiedData = JSON.stringify(dataToSubmit);
    const response = await createNewsFeed({
      variables: {
        input: stringifiedData,
      },
    });
    console.log("response", response);
    console.log("stringifiedData", JSON.stringify(dataToSubmit, null, 2));
  };

  const handleUploadMediaImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: true,
      });

      console.log("\nresult", result);

      if (result.assets && result.assets.length > 0) {
        // Merge new files with existing state
        setSelectedFile((prevFiles) => [...prevFiles, ...result.assets]);

        // Upload each file
        const uploadPromises = result.assets.map(async (file: any) => {
          const formData = new FormData();

          // Clean path if iOS, otherwise use as is
          const uri =
            Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri;

          formData.append("file", {
            uri,
            name: file.name || `file-${Date.now()}.pdf`,
            type: file.mimeType || "application/pdf",
          } as any);

          // Add folder path for assignment
          const folderPath = `newsfeedFiles`;

          const response = await fetch(
            `${API_URL}/files/upload?folderPath=${folderPath}`,
            {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("response", response);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload file");
          }

          const data = await response.json();
          console.log("Uploaded:", data);
          return data.data?.objectName || data.url; // Adjust based on your backend response
        });

        const uploadedFilePaths = await Promise.all(uploadPromises);
        setFilePath(uploadedFilePaths);

        // Step 2: Get actual URLs
        const presignedUrls = await Promise.all(
          uploadedFilePaths.map((path) => getPresignedUrl(path))
        );

        setPresignedUrls(presignedUrls);

        console.log("presignedUrls", presignedUrls);
        console.log("✅ Uploaded file paths:", uploadedFilePaths);

        Alert.alert("Success", "Assignment submitted successfully!", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("❌ Error uploading files:", error);
      Alert.alert("Error", "Failed to upload files. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleSubmitQuestionImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: true,
      });

      console.log("\nresult", result);

      if (result.assets && result.assets.length > 0) {
        // Merge new files with existing state
        setSelectedQuestionFiles((prevFiles) => [
          ...prevFiles,
          ...result.assets,
        ]);

        // Upload each file
        const uploadPromises = result.assets.map(
          async (file: any, index: number) => {
            const formData = new FormData();

            // Clean path if iOS, otherwise use as is
            const uri =
              Platform.OS === "ios"
                ? file.uri.replace("file://", "")
                : file.uri;

            formData.append("file", {
              uri,
              name: file.name || `question-${Date.now()}-${index}.jpg`,
              type: file.mimeType || "image/*",
            } as any);

            // Add folder path for question images
            const folderPath = `newsfeed/questions/${index}`;
            console.log("folderPath for question images", folderPath);

            const response = await fetch(
              `${API_URL}/files/upload?folderPath=${folderPath}`,
              {
                method: "POST",
                body: formData,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("response", response);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Failed to upload file");
            }

            const data = await response.json();
            console.log("Uploaded:", data);
            return data.data?.objectName || data.url; // Adjust based on your backend response
          }
        );

        const uploadedFilePaths = await Promise.all(uploadPromises);
        const questionFilePath = uploadedFilePaths.map((path, index) => ({
          url: path,
          title: `question-${index}`,
        }));
        setQuestionFilePath(questionFilePath);

        // Step 2: Get actual URLs
        const presignedUrls = await Promise.all(
          uploadedFilePaths.map((path) => getPresignedUrl(path))
        );

        setQuestionPresignedUrls(presignedUrls);

        console.log("presignedUrls", presignedUrls);

        console.log("✅ Uploaded question image paths:", uploadedFilePaths);

        Alert.alert("Success", "Question images uploaded successfully!", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("❌ Error uploading question images:", error);
      Alert.alert(
        "Error",
        "Failed to upload question images. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  console.log("filePath", filePath);

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    multiline = false,
    icon?: React.ReactNode
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        {icon && <View style={styles.labelIcon}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  const renderCategorySelector = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <FileText size={18} color="#6b7280" />
        <Text style={styles.label}>Category</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.categoryId || category.id}
            style={[
              styles.categoryChip,
              formData.category === category.categoryId &&
                styles.selectedCategoryChip,
            ]}
            onPress={() => updateFormData("category", category.categoryId)}
          >
            <Text
              style={[
                styles.categoryText,
                formData.category === category.categoryId &&
                  styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Flag size={18} color="#6b7280" />
        <Text style={styles.label}>Priority</Text>
      </View>
      <View style={styles.priorityContainer}>
        {priorities.map((priority) => (
          <TouchableOpacity
            key={priority.value}
            style={[
              styles.priorityChip,
              formData.priority === priority.value && {
                backgroundColor: priority.color + "20",
                borderColor: priority.color,
              },
            ]}
            onPress={() => updateFormData("priority", priority.value)}
          >
            <View
              style={[styles.priorityDot, { backgroundColor: priority.color }]}
            />
            <Text
              style={[
                styles.priorityText,
                formData.priority === priority.value && {
                  color: priority.color,
                },
              ]}
            >
              {priority.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderLinksSection = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Link2 size={18} color="#6b7280" />
        <Text style={styles.label}>Links</Text>
      </View>
      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.addItemInput}
          value={newLink}
          onChangeText={setNewLink}
          placeholder="Add a link..."
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity style={styles.addButton} onPress={addLink}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      {formData.links?.map((link, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText} numberOfLines={1}>
            {link}
          </Text>
          <TouchableOpacity
            onPress={() => removeLink(index)}
            style={styles.removeButton}
          >
            <X size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderImageUrlsSection = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <ImageIcon size={18} color="#6b7280" />
        <Text style={styles.label}>Image URLs</Text>
      </View>
      <View style={styles.addItemContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleUploadMediaImage()}
        >
          <Text style={styles.submitButtonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
      {/* Image Preview Section */}
      {presignedUrls.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {presignedUrls.map((uri, idx) => (
            <View key={idx} style={{ marginRight: 12 }}>
              <Image
                source={{ uri }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "#ef4444",
                  borderRadius: 12,
                  padding: 4,
                  zIndex: 2,
                }}
                onPress={async () => {
                  try {
                    // Get the corresponding MinIO path (objectName)
                    const objectName = filePath[idx];
                    const response = await fetch(
                      `${API_URL}/files/${encodeURIComponent(objectName)}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.message || "Failed to delete file");
                    }
                    // Remove from state
                    setPresignedUrls((prev) =>
                      prev.filter((_, i) => i !== idx)
                    );
                    setFilePath((prev) => prev.filter((_, i) => i !== idx));
                    Alert.alert("Success", "Image deleted successfully!");
                  } catch (error) {
                    console.error("❌ Error deleting file:", error);
                    Alert.alert(
                      "Error",
                      "Failed to delete image. Please try again."
                    );
                  }
                }}
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {/* {formData.imageUrls?.map((url, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemText} numberOfLines={1}>
            {url}
          </Text>
          <TouchableOpacity
            onPress={() => removeImageUrl(index)}
            style={styles.removeButton}
          >
            <X size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ))} */}
    </View>
  );

  const renderQuestionImagesSection = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <ImageIcon size={18} color="#6b7280" />
        <Text style={styles.label}>Question Images</Text>
      </View>
      <View style={styles.addItemContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitQuestionImage}
        >
          <Text style={styles.submitButtonText}>Upload Question Images</Text>
        </TouchableOpacity>
      </View>
      {/* Question Image Preview Section */}
      {questionPresignedUrls.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {questionPresignedUrls.map((uri, idx) => (
            <View key={idx} style={{ marginRight: 12 }}>
              <Image
                source={{ uri }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "#ef4444",
                  borderRadius: 12,
                  padding: 4,
                  zIndex: 2,
                }}
                onPress={async () => {
                  try {
                    // Get the corresponding MinIO path (objectName)
                    const objectName = questionFilePath[idx].url;
                    const response = await fetch(
                      `${API_URL}/files/${encodeURIComponent(objectName)}`,
                      {
                        method: "DELETE",
                      }
                    );
                    if (!response.ok) {
                      const error = await response.json();
                      throw new Error(error.message || "Failed to delete file");
                    }
                    // Remove from state
                    setQuestionPresignedUrls((prev) =>
                      prev.filter((_, i) => i !== idx)
                    );
                    setQuestionFilePath((prev) =>
                      prev.filter((_, i) => i !== idx)
                    );
                    Alert.alert(
                      "Success",
                      "Question image deleted successfully!"
                    );
                  } catch (error) {
                    console.error("❌ Error deleting question image:", error);
                    Alert.alert(
                      "Error",
                      "Failed to delete question image. Please try again."
                    );
                  }
                }}
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {questionImages.map((image, index) => (
        <View key={index} style={styles.listItem}>
          <View>
            <Text style={styles.listItemText} numberOfLines={1}>
              {image.title}
            </Text>
            <Text style={styles.listItemSubtext} numberOfLines={1}>
              {image.url}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => removeQuestionImage(index)}
            style={styles.removeButton}
          >
            <X size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderOptionsSection = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <HelpCircle size={18} color="#6b7280" />
        <Text style={styles.label}>Options</Text>
      </View>
      {options.map((option) => (
        <View key={option.id} style={styles.optionItem}>
          <TouchableOpacity
            onPress={() => toggleCorrectOption(option.id)}
            style={[
              styles.optionRadio,
              option.isCorrect && styles.optionRadioSelected,
            ]}
          >
            {option.isCorrect && <View style={styles.optionRadioInner} />}
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={option.text}
            onChangeText={(text) => updateOption(option.id, text)}
            placeholder="Option text..."
            placeholderTextColor="#9ca3af"
          />
          {options.length > 2 && (
            <TouchableOpacity
              onPress={() => removeOption(option.id)}
              style={styles.removeButton}
            >
              <X size={16} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity
        style={[styles.addButton, { alignSelf: "flex-start", padding: 12 }]}
        onPress={addOption}
      >
        <Plus size={20} color="#ffffff" />
        <Text style={styles.addButtonText}>Add Option</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestionsTab = () => (
    <View>
      {renderInput(
        "Question Text",
        questionText,
        setQuestionText,
        "Enter the question...",
        false,
        <HelpCircle size={18} color="#6b7280" />
      )}

      {renderInput(
        "Question Content",
        questionContent,
        setQuestionContent,
        "Additional details about the question (optional)...",
        true,
        <FileText size={18} color="#6b7280" />
      )}

      {renderQuestionImagesSection()}

      {renderOptionsSection()}

      {renderInput(
        "Solution",
        solution,
        setSolution,
        "Explain the solution (optional)...",
        true,
        <HelpCircle size={18} color="#6b7280" />
      )}
    </View>
  );

  const renderVisibilityToggle = () => (
    <View style={styles.inputContainer}>
      <View style={styles.toggleContainer}>
        <View style={styles.labelContainer}>
          {formData.isVisible ? (
            <Eye size={18} color="#6b7280" />
          ) : (
            <EyeOff size={18} color="#6b7280" />
          )}
          <Text style={styles.label}>Visibility</Text>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            {formData.isVisible ? "Public" : "Private"}
          </Text>
          <Switch
            value={formData.isVisible}
            onValueChange={(value) => updateFormData("isVisible", value)}
            trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
            thumbColor={formData.isVisible ? "#ffffff" : "#f3f4f6"}
          />
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "media" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("media")}
      >
        <ImageIcon
          size={20}
          color={activeTab === "media" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "media" && styles.activeTabButtonText,
          ]}
        >
          Media
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "links" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("links")}
      >
        <Link2
          size={20}
          color={activeTab === "links" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "links" && styles.activeTabButtonText,
          ]}
        >
          Links
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "questions" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("questions")}
      >
        <HelpCircle
          size={20}
          color={activeTab === "questions" ? "#3b82f6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabButtonText,
            activeTab === "questions" && styles.activeTabButtonText,
          ]}
        >
          Questions
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "media":
        return renderImageUrlsSection();
      case "links":
        return renderLinksSection();
      case "questions":
        return renderQuestionsTab();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        {renderInput(
          "Title",
          formData.title || "",
          (text) => updateFormData("title", text),
          "Enter news title...",
          false,
          <FileText size={18} color="#6b7280" />
        )}

        {/* Content */}
        {renderInput(
          "Content",
          formData.content || "",
          (text) => updateFormData("content", text),
          "Write your news content here...",
          true,
          <FileText size={18} color="#6b7280" />
        )}

        <View style={styles.filtersContainer}>
          <Text style={styles.label}>Schedule Date</Text>
          {/* Date Filter */}
          <TouchableOpacity
            style={styles.dateFilter}
            onPress={() => setIsDatePickerOpen(true)}
            accessibilityLabel="Select date"
          >
            <Calendar size={20} color="#6b7280" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {isDatePickerOpen && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              timeZoneName="Asia/Kathmandu"
              onChange={(event, date) => {
                setIsDatePickerOpen(false);
                if (date) {
                  setSelectedDate(date as Date);
                  formData.schedule = date.toISOString();
                }
              }}
              is24Hour={false}
            />
          )}
        </View>

        <View style={styles.filtersContainer}>
          <Text style={styles.label}>Schedule Time</Text>
          {/* Date Filter */}

          <TouchableOpacity
            style={styles.dateFilter}
            onPress={() => setShowTimePicker(true)}
            accessibilityLabel="Select date"
          >
            <Clock size={20} color="#6b7280" />
            <Text style={styles.dateText}>
              {scheduleTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={scheduleTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              timeZoneName="Asia/Kathmandu"
              onChange={(event, date) => {
                setShowTimePicker(false);
                if (date) {
                  setScheduleTime(date as Date);
                  // Only set the time part as string
                  setScheduleTimeString(date.toTimeString().slice(0, 8));
                }
              }}
              is24Hour={false}
            />
          )}
        </View>

        {/* Category */}
        {renderCategorySelector()}

        {/* Priority */}
        {renderPrioritySelector()}

        {/* Tabs */}
        {renderTabs()}

        {/* Tab Content */}
        {renderTabContent()}

        {/* Visibility */}
        {renderVisibilityToggle()}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#374151" />
            <Text style={styles.saveButtonText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.publishButton}
            onPress={handleSubmitNewsfeed}
          >
            <Send size={20} color="#ffffff" />
            <Text style={styles.publishButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#f9fafb",
    minHeight: 56,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedCategoryChip: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  categoryText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#ffffff",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 4,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#f9fafb",
    marginRight: 12,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginRight: 12,
  },
  listItemSubtext: {
    flex: 1,
    fontSize: 12,
    color: "#6b7280",
    marginRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 12,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  publishButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 32,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 8,
  },
  activeTabButtonText: {
    color: "#3b82f6",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioSelected: {
    borderColor: "#3b82f6",
  },
  optionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  questionsList: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  questionItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  questionItemText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  questionItemSubtext: {
    fontSize: 12,
    color: "#6b7280",
  },
  filtersContainer: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 16,
    gap: 8,
  },
  dateFilterContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateFilter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 16,
  },
});

export default NewsFeedForm;

const getPresignedUrl = async (objectName: string) => {
  const expirySeconds = 3600; // Optional
  const response = await fetch(
    `${API_URL}/files/download/${encodeURIComponent(
      objectName
    )}/presigned-url?expirySeconds=${expirySeconds}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch presigned URL");
  }

  const result = await response.json();
  return result.data?.url; // This is the actual downloadable URL
};
