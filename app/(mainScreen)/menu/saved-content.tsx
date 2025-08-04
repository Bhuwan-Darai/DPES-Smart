// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Modal,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { ChevronLeft, PlayCircle, FileText, Trash2 } from "lucide-react-native";
// import * as FileSystem from "expo-file-system";
// import * as SecureStore from "expo-secure-store";
// import PDFViewer from "@/components/viewer/PDFViewer";
// import VideoPlayer from "@/components/viewer/VideoPlayer";

// type SavedContent = {
//   id: string;
//   title: string;
//   chapterTitle: string;
//   courseTitle: string;
//   type: "video" | "pdf";
//   localUri: string;
//   downloadDate: string;
//   isVideo?: boolean;
// };

// const SavedContentScreen = () => {
//   const navigation = useNavigation();
//   const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
//   const [selectedContent, setSelectedContent] = useState<SavedContent | null>(
//     null
//   );
//   const [isViewerVisible, setIsViewerVisible] = useState(false);

//   useEffect(() => {
//     loadSavedContent();
//   }, []);

//   const loadSavedContent = async () => {
//     try {
//       const downloaded = await SecureStore.getItemAsync("downloadedContent");
//       if (downloaded) {
//         const contentList = Object.values(
//           JSON.parse(downloaded)
//         ) as SavedContent[];
//         setSavedContent(
//           contentList.sort(
//             (a, b) =>
//               new Date(b.downloadDate).getTime() -
//               new Date(a.downloadDate).getTime()
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error loading saved content:", error);
//     }
//   };

//   const handleDelete = async (content: SavedContent) => {
//     try {
//       // Only delete file if it's a PDF
//       if (!content.isVideo) {
//         await FileSystem.deleteAsync(content.localUri);
//       }

//       // Remove from secure storage
//       const downloaded =
//         (await SecureStore.getItemAsync("downloadedContent")) || "{}";
//       const downloadedList = JSON.parse(downloaded);
//       delete downloadedList[content.id];
//       await SecureStore.setItemAsync(
//         "downloadedContent",
//         JSON.stringify(downloadedList)
//       );

//       // Update state
//       setSavedContent((prev) => prev.filter((item) => item.id !== content.id));
//       Alert.alert("Success", "Content deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting content:", error);
//       Alert.alert("Error", "Failed to delete content. Please try again.");
//     }
//   };

//   const handleContentPress = async (content: SavedContent) => {
//     try {
//       if (!content.isVideo) {
//         // Check if file exists for PDFs
//         const fileInfo = await FileSystem.getInfoAsync(content.localUri);
//         if (!fileInfo.exists) {
//           Alert.alert(
//             "Error",
//             "Content file not found. Please download again."
//           );
//           return;
//         }
//       }

//       setSelectedContent(content);
//       setIsViewerVisible(true);
//     } catch (error) {
//       console.error("Error opening content:", error);
//       Alert.alert("Error", "Failed to open content. Please try again.");
//     }
//   };

//   const closeViewer = () => {
//     setIsViewerVisible(false);
//     setSelectedContent(null);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Saved Content</Text>
//       </View>

//       <ScrollView style={styles.content}>
//         {savedContent.length === 0 ? (
//           <Text style={styles.emptyText}>No saved content found</Text>
//         ) : (
//           savedContent.map((content) => (
//             <TouchableOpacity
//               key={content.id}
//               style={styles.contentItem}
//               onPress={() => handleContentPress(content)}
//             >
//               {content.type === "video" ? (
//                 <PlayCircle size={24} color="#007AFF" />
//               ) : (
//                 <FileText size={24} color="#007AFF" />
//               )}
//               <View style={styles.contentInfo}>
//                 <Text style={styles.contentTitle}>{content.title}</Text>
//                 <Text style={styles.courseTitle}>{content.courseTitle}</Text>
//                 <Text style={styles.chapterTitle}>{content.chapterTitle}</Text>
//                 <Text style={styles.downloadDate}>
//                   {content.isVideo ? "Saved on" : "Downloaded on"}{" "}
//                   {formatDate(content.downloadDate)}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => {
//                   Alert.alert(
//                     "Delete Content",
//                     "Are you sure you want to delete this content?",
//                     [
//                       { text: "Cancel", style: "cancel" },
//                       {
//                         text: "Delete",
//                         onPress: () => handleDelete(content),
//                         style: "destructive",
//                       },
//                     ]
//                   );
//                 }}
//               >
//                 <Trash2 size={20} color="#FF3B30" />
//               </TouchableOpacity>
//             </TouchableOpacity>
//           ))
//         )}
//       </ScrollView>

//       <Modal
//         visible={isViewerVisible}
//         onRequestClose={closeViewer}
//         animationType="slide"
//       >
//         <View style={styles.modalContainer}>
//           <TouchableOpacity style={styles.closeButton} onPress={closeViewer}>
//             <ChevronLeft size={24} color="#000" />
//             <Text style={styles.closeButtonText}>Back</Text>
//           </TouchableOpacity>

//           {selectedContent?.type === "pdf" ? (
//             <View style={{ flex: 1 }}>
//               <PDFViewer
//                 source={{
//                   uri: selectedContent.localUri,
//                   cache: true,
//                 }}
//               />
//             </View>
//           ) : selectedContent?.type === "video" ? (
//             <VideoPlayer
//               videoId={selectedContent.localUri}
//               onError={(error: Error) => {
//                 Alert.alert(
//                   "Error",
//                   "Failed to load video. Please check the URL and try again."
//                 );
//                 closeViewer();
//               }}
//             />
//           ) : null}
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E5EA",
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontFamily: "Inter_600SemiBold",
//     color: "#000",
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#666",
//     fontSize: 16,
//     marginTop: 24,
//   },
//   contentItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#E5E5EA",
//   },
//   contentInfo: {
//     flex: 1,
//     marginLeft: 12,
//     marginRight: 12,
//   },
//   contentTitle: {
//     fontFamily: "Inter_600SemiBold",
//     fontSize: 16,
//     color: "#000",
//     marginBottom: 4,
//   },
//   courseTitle: {
//     fontFamily: "Inter_500Medium",
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 2,
//   },
//   chapterTitle: {
//     fontFamily: "Inter_400Regular",
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   downloadDate: {
//     fontFamily: "Inter_400Regular",
//     fontSize: 12,
//     color: "#666",
//   },
//   deleteButton: {
//     padding: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   closeButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E5EA",
//   },
//   closeButtonText: {
//     marginLeft: 8,
//     fontSize: 16,
//     fontFamily: "Inter_500Medium",
//     color: "#000",
//   },
// });

// export default SavedContentScreen;

import { View, Text } from "react-native";
import React from "react";

export default function SavedContentScreen() {
  return (
    <View>
      <Text>SavedContentScreen</Text>
    </View>
  );
}
