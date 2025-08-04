// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Alert,
// } from "react-native";

// import {
//   Wifi,
//   Cpu,
//   Smartphone,
//   Database,
//   Book,
//   Code,
//   Play,
//   X,
//   Wrench,
//   Video,
//   Image as ImageIcon,
//   ChevronLeft,
// } from "lucide-react-native";
// import CourseTabs from "@/components/CourseTabs";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// import { WebView } from "react-native-webview";
// import PDFViewer from "@/components/viewer/PDFViewer";
// import VideoPlayer from "@/components/viewer/VideoPlayer";

// type IoTCourseParamList = {
//   IoTCourseId: { id: string };
// };

// interface ExampleDialogProps {
//   visible: boolean;
//   onClose: () => void;
//   example: {
//     title: string;
//     description: string;
//     difficulty: string;
//     code: string;
//     image: string;
//     tools: Array<{ name: string; description: string }>;
//     steps: string[];
//     videoUrl: string;
//   };
// }

// function ExampleDialog({ visible, onClose, example }: ExampleDialogProps) {
//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>{example.title}</Text>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <X size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.modalScroll}>
//             {/* Picture Section */}
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <ImageIcon size={20} color="#007AFF" />
//                 <Text style={styles.sectionTitle}>Picture</Text>
//               </View>
//               <Image
//                 source={{ uri: example.image }}
//                 style={styles.exampleImage}
//                 resizeMode="cover"
//               />
//             </View>

//             {/* Tools Section */}
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Wrench size={20} color="#007AFF" />
//                 <Text style={styles.sectionTitle}>Tools Used</Text>
//               </View>
//               {example.tools.map((tool, index) => (
//                 <View key={index} style={styles.toolItem}>
//                   <Text style={styles.toolName}>{tool.name}</Text>
//                   <Text style={styles.toolDescription}>{tool.description}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Steps Section */}
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Code size={20} color="#007AFF" />
//                 <Text style={styles.sectionTitle}>Steps</Text>
//               </View>
//               {example.steps.map((step, index) => (
//                 <View key={index} style={styles.stepItem}>
//                   <Text style={styles.stepNumber}>{index + 1}</Text>
//                   <Text style={styles.stepText}>{step}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Video Section */}
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Video size={20} color="#007AFF" />
//                 <Text style={styles.sectionTitle}>Video Tutorial</Text>
//               </View>
//               <TouchableOpacity style={styles.videoButton}>
//                 <Play size={24} color="#fff" />
//                 <Text style={styles.videoButtonText}>Watch Video</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// interface QuizQuestion {
//   question: string;
//   options: string[];
//   correctOption: number;
// }

// interface PlayContent {
//   type: "editor" | "quiz";
//   title: string;
//   description: string;
//   content: string | QuizQuestion[];
// }

// interface Section {
//   title: string;
//   duration: string;
//   completed: boolean;
//   type?: string;
//   content?: string;
// }

// interface Chapter {
//   title: string;
//   sections: Section[];
// }

// interface Example {
//   title: string;
//   description: string;
//   difficulty: string;
//   code: string;
//   image?: string;
//   tools?: Array<{ name: string; description: string }>;
//   steps?: string[];
//   videoUrl?: string;
// }

// interface Course {
//   title: string;
//   chapters: Chapter[];
//   examples: Example[];
//   playContent: PlayContent[];
// }

// type CourseData = {
//   [key: string]: Course;
// };

// const IOTCourseScreen = () => {
//   const [activeTab, setActiveTab] = useState("learn");
//   const [selectedExample, setSelectedExample] = useState<any>(null);
//   const [showExampleDialog, setShowExampleDialog] = useState(false);
//   const [selectedContent, setSelectedContent] = useState<any>(null);
//   const [isViewerVisible, setIsViewerVisible] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);

//   const navigation =
//     useNavigation<
//       NativeStackNavigationProp<IoTCourseParamList, "IoTCourseId">
//     >();
//   const route = useRoute();
//   const { id } = route.params as IoTCourseParamList["IoTCourseId"];

//   // Sample course data matching the courses from the main IoT screen
//   const courseData: CourseData = {
//     "iot-fundamentals": {
//       title: "IoT Fundamentals",
//       chapters: [
//         {
//           title: "Introduction to IoT Basics",
//           sections: [
//             {
//               title: "What is IoT?",
//               duration: "15 mins",
//               completed: true,
//               type: "video",
//               content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//             },
//             {
//               title: "IoT Architecture Overview",
//               duration: "20 mins",
//               completed: true,
//               type: "pdf",
//               content:
//                 "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//             },
//             {
//               title: "Basic Components",
//               duration: "25 mins",
//               completed: false,
//               type: "video",
//               content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//             },
//             {
//               title: "Getting Started",
//               duration: "30 mins",
//               completed: false,
//               type: "pdf",
//               content:
//                 "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//             },
//           ],
//         },
//       ],
//       examples: [
//         {
//           title: "Basic Sensor Reading",
//           description: "Learn to read data from basic sensors",
//           difficulty: "Beginner",
//           code: "arduino",
//           image: "https://example.com/sensor-reading.jpg",
//           tools: [
//             {
//               name: "Arduino Uno",
//               description: "Microcontroller board for IoT projects",
//             },
//             {
//               name: "Temperature Sensor",
//               description: "DHT11 sensor for temperature and humidity readings",
//             },
//             {
//               name: "Breadboard",
//               description: "Prototyping board for circuit connections",
//             },
//           ],
//           steps: [
//             "Connect the DHT11 sensor to Arduino pins",
//             "Install the DHT library in Arduino IDE",
//             "Write the code to read sensor data",
//             "Upload and test the circuit",
//           ],
//           videoUrl: "https://example.com/sensor-video",
//         },
//       ],
//       playContent: [
//         {
//           type: "editor",
//           title: "Arduino Code Editor",
//           description: "Write and test your Arduino code in real-time",
//           content: `
//             <!DOCTYPE html>
//             <html>
//               <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                   body {
//                     margin: 0;
//                     padding: 16px;
//                     font-family: monospace;
//                     background: #1E1E1E;
//                     color: #fff;
//                   }
//                   #editor {
//                     width: 100%;
//                     height: 300px;
//                     border: 1px solid #333;
//                     border-radius: 4px;
//                     margin-bottom: 16px;
//                   }
//                   .button {
//                     background: #007AFF;
//                     color: white;
//                     border: none;
//                     padding: 8px 16px;
//                     border-radius: 4px;
//                     cursor: pointer;
//                   }
//                 </style>
//                 <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
//               </head>
//               <body>
//                 <div id="editor">void setup() {
//   // Your setup code here
// }

// void loop() {
//   // Your loop code here
// }</div>
//                 <button class="button" onclick="runCode()">Run Code</button>
//                 <script>
//                   var editor = ace.edit("editor");
//                   editor.setTheme("ace/theme/monokai");
//                   editor.session.setMode("ace/mode/c_cpp");

//                   function runCode() {
//                     const code = editor.getValue();
//                     // Here you would typically send the code to a backend for execution
//                     alert('Code execution simulated!');
//                   }
//                 </script>
//               </body>
//             </html>
//           `,
//         },
//         {
//           type: "quiz",
//           title: "IoT Basics Quiz",
//           description: "Test your knowledge of IoT fundamentals",
//           content: [
//             {
//               question: "What does IoT stand for?",
//               options: [
//                 "Internet of Things",
//                 "Internet of Tools",
//                 "Internet of Technology",
//                 "Internet of Tools",
//               ],
//               correctOption: 0,
//             },
//             {
//               question: "Which of these is NOT a common IoT protocol?",
//               options: ["MQTT", "HTTP", "FTP", "CoAP"],
//               correctOption: 2,
//             },
//             {
//               question: "What is the main purpose of IoT?",
//               options: [
//                 "To make devices look cool",
//                 "To connect devices and enable data exchange",
//                 "To replace all computers",
//                 "To create more internet traffic",
//               ],
//               correctOption: 1,
//             },
//           ],
//         },
//       ],
//     },
//     "wireless-networking": {
//       title: "Wireless Networking for IoT",
//       chapters: [
//         {
//           title: "Wireless Protocols",
//           sections: [
//             { title: "WiFi Basics", duration: "20 mins", completed: true },
//             {
//               title: "Bluetooth Standards",
//               duration: "25 mins",
//               completed: true,
//             },
//             { title: "LoRaWAN", duration: "30 mins", completed: false },
//             { title: "ZigBee Protocol", duration: "25 mins", completed: false },
//           ],
//         },
//       ],
//       examples: [
//         {
//           title: "WiFi Connection Setup",
//           description: "Configure WiFi on IoT devices",
//           difficulty: "Intermediate",
//           code: "python",
//         },
//       ],
//       playContent: [
//         {
//           type: "editor",
//           title: "WiFi Configuration Editor",
//           description: "Write and test your WiFi configuration code",
//           content: `
//             <!DOCTYPE html>
//             <html>
//               <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                   body {
//                     margin: 0;
//                     padding: 16px;
//                     font-family: monospace;
//                     background: #1E1E1E;
//                     color: #fff;
//                   }
//                   #editor {
//                     width: 100%;
//                     height: 300px;
//                     border: 1px solid #333;
//                     border-radius: 4px;
//                     margin-bottom: 16px;
//                   }
//                   .button {
//                     background: #007AFF;
//                     color: white;
//                     border: none;
//                     padding: 8px 16px;
//                     border-radius: 4px;
//                     cursor: pointer;
//                   }
//                 </style>
//                 <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
//               </head>
//               <body>
//                 <div id="editor">import network

// # Configure WiFi
// wlan = network.WLAN(network.STA_IF)
// wlan.active(True)
// wlan.connect('SSID', 'PASSWORD')</div>
//                 <button class="button" onclick="runCode()">Run Code</button>
//                 <script>
//                   var editor = ace.edit("editor");
//                   editor.setTheme("ace/theme/monokai");
//                   editor.session.setMode("ace/mode/python");

//                   function runCode() {
//                     const code = editor.getValue();
//                     // Here you would typically send the code to a backend for execution
//                     alert('Code execution simulated!');
//                   }
//                 </script>
//               </body>
//             </html>
//           `,
//         },
//         {
//           type: "quiz",
//           title: "Wireless Networking Quiz",
//           description: "Test your knowledge of wireless protocols",
//           content: [
//             {
//               question:
//                 "Which wireless protocol is commonly used for short-range communication?",
//               options: ["WiFi", "Bluetooth", "LoRaWAN", "ZigBee"],
//               correctOption: 1,
//             },
//             {
//               question: "What is the typical range of WiFi?",
//               options: [
//                 "10-30 meters",
//                 "100-300 meters",
//                 "1-3 kilometers",
//                 "10-30 kilometers",
//               ],
//               correctOption: 0,
//             },
//           ],
//         },
//       ],
//     },
//     "cloud-integration": {
//       title: "IoT Cloud Integration",
//       chapters: [
//         {
//           title: "Cloud Platforms",
//           sections: [
//             { title: "AWS IoT Core", duration: "30 mins", completed: true },
//             { title: "Azure IoT Hub", duration: "35 mins", completed: false },
//             {
//               title: "Google Cloud IoT",
//               duration: "30 mins",
//               completed: false,
//             },
//             { title: "Data Storage", duration: "25 mins", completed: false },
//           ],
//         },
//       ],
//       examples: [
//         {
//           title: "Cloud Data Upload",
//           description: "Send sensor data to cloud platform",
//           difficulty: "Advanced",
//           code: "python",
//         },
//       ],
//       playContent: [
//         {
//           type: "editor",
//           title: "Cloud Integration Editor",
//           description: "Write and test your cloud integration code",
//           content: `
//             <!DOCTYPE html>
//             <html>
//               <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                   body {
//                     margin: 0;
//                     padding: 16px;
//                     font-family: monospace;
//                     background: #1E1E1E;
//                     color: #fff;
//                   }
//                   #editor {
//                     width: 100%;
//                     height: 300px;
//                     border: 1px solid #333;
//                     border-radius: 4px;
//                     margin-bottom: 16px;
//                   }
//                   .button {
//                     background: #007AFF;
//                     color: white;
//                     border: none;
//                     padding: 8px 16px;
//                     border-radius: 4px;
//                     cursor: pointer;
//                   }
//                 </style>
//                 <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
//               </head>
//               <body>
//                 <div id="editor">import boto3

// # Initialize AWS IoT client
// iot_client = boto3.client('iot-data')

// # Publish data to AWS IoT
// response = iot_client.publish(
//     topic='sensors/data',
//     payload='{"temperature": 25, "humidity": 60}'
// )</div>
//                 <button class="button" onclick="runCode()">Run Code</button>
//                 <script>
//                   var editor = ace.edit("editor");
//                   editor.setTheme("ace/theme/monokai");
//                   editor.session.setMode("ace/mode/python");

//                   function runCode() {
//                     const code = editor.getValue();
//                     // Here you would typically send the code to a backend for execution
//                     alert('Code execution simulated!');
//                   }
//                 </script>
//               </body>
//             </html>
//           `,
//         },
//         {
//           type: "quiz",
//           title: "Cloud Integration Quiz",
//           description: "Test your knowledge of cloud platforms",
//           content: [
//             {
//               question: "Which AWS service is commonly used for IoT?",
//               options: ["AWS IoT Core", "AWS Lambda", "AWS S3", "AWS EC2"],
//               correctOption: 0,
//             },
//             {
//               question: "What is the main purpose of Azure IoT Hub?",
//               options: [
//                 "Data storage",
//                 "Device management and communication",
//                 "Video streaming",
//                 "Web hosting",
//               ],
//               correctOption: 1,
//             },
//           ],
//         },
//       ],
//     },
//     "iot-security": {
//       title: "IoT Security",
//       chapters: [
//         {
//           title: "Security Fundamentals",
//           sections: [
//             { title: "Security Threats", duration: "25 mins", completed: true },
//             {
//               title: "Encryption Basics",
//               duration: "30 mins",
//               completed: false,
//             },
//             { title: "Authentication", duration: "35 mins", completed: false },
//             { title: "Best Practices", duration: "30 mins", completed: false },
//           ],
//         },
//       ],
//       examples: [
//         {
//           title: "Secure Communication",
//           description: "Implement secure device communication",
//           difficulty: "Advanced",
//           code: "python",
//         },
//       ],
//       playContent: [
//         {
//           type: "editor",
//           title: "Security Implementation Editor",
//           description: "Write and test your security implementation code",
//           content: `
//             <!DOCTYPE html>
//             <html>
//               <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                   body {
//                     margin: 0;
//                     padding: 16px;
//                     font-family: monospace;
//                     background: #1E1E1E;
//                     color: #fff;
//                   }
//                   #editor {
//                     width: 100%;
//                     height: 300px;
//                     border: 1px solid #333;
//                     border-radius: 4px;
//                     margin-bottom: 16px;
//                   }
//                   .button {
//                     background: #007AFF;
//                     color: white;
//                     border: none;
//                     padding: 8px 16px;
//                     border-radius: 4px;
//                     cursor: pointer;
//                   }
//                 </style>
//                 <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"></script>
//               </head>
//               <body>
//                 <div id="editor">from cryptography.fernet import Fernet

// # Generate encryption key
// key = Fernet.generate_key()
// cipher_suite = Fernet(key)

// # Encrypt data
// data = b"Sensitive IoT data"
// encrypted_data = cipher_suite.encrypt(data)</div>
//                 <button class="button" onclick="runCode()">Run Code</button>
//                 <script>
//                   var editor = ace.edit("editor");
//                   editor.setTheme("ace/theme/monokai");
//                   editor.session.setMode("ace/mode/python");

//                   function runCode() {
//                     const code = editor.getValue();
//                     // Here you would typically send the code to a backend for execution
//                     alert('Code execution simulated!');
//                   }
//                 </script>
//               </body>
//             </html>
//           `,
//         },
//         {
//           type: "quiz",
//           title: "IoT Security Quiz",
//           description: "Test your knowledge of IoT security",
//           content: [
//             {
//               question:
//                 "What is the most common security threat in IoT devices?",
//               options: [
//                 "Malware",
//                 "Default passwords",
//                 "Network attacks",
//                 "Physical damage",
//               ],
//               correctOption: 1,
//             },
//             {
//               question: "Which encryption algorithm is commonly used in IoT?",
//               options: ["AES", "DES", "RSA", "MD5"],
//               correctOption: 0,
//             },
//           ],
//         },
//       ],
//     },
//   };

//   // Get the specific course data based on the ID
//   const currentCourse = courseData[id as keyof typeof courseData];

//   const handleContentPress = (section: any) => {
//     setSelectedContent(section);
//     setIsViewerVisible(true);
//   };

//   const closeViewer = () => {
//     setIsViewerVisible(false);
//     setSelectedContent(null);
//   };

//   const handleQuizAnswer = (selectedOption: number) => {
//     const currentQuiz = currentCourse.playContent.find(
//       (content) => content.type === "quiz"
//     ) as PlayContent;
//     const questions = currentQuiz.content as QuizQuestion[];

//     if (selectedOption === questions[currentQuestionIndex].correctOption) {
//       setScore(score + 1);
//     }

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowScore(true);
//     }
//   };

//   const resetQuiz = () => {
//     setCurrentQuestionIndex(0);
//     setScore(0);
//     setShowScore(false);
//   };

//   const renderLearnTab = () => (
//     <View>
//       {currentCourse.chapters.map((chapter, index) => (
//         <View key={index} style={styles.chapterCard}>
//           <Text style={styles.chapterTitle}>{chapter.title}</Text>
//           {chapter.sections.map((section, sectionIndex) => (
//             <TouchableOpacity
//               key={sectionIndex}
//               style={[
//                 styles.sectionItem,
//                 section.completed && styles.completedSection,
//               ]}
//               onPress={() => handleContentPress(section)}
//             >
//               <Book size={20} color={section.completed ? "#34C759" : "#666"} />
//               <View style={styles.sectionInfo}>
//                 <Text style={styles.sectionTitle}>{section.title}</Text>
//                 <Text style={styles.sectionDuration}>{section.duration}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       ))}
//     </View>
//   );

//   const renderTryTab = () => (
//     <View>
//       {currentCourse.examples.map((example, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.exampleCard}
//           onPress={() => {
//             setSelectedExample(example);
//             setShowExampleDialog(true);
//           }}
//         >
//           <View style={styles.exampleHeader}>
//             <Code size={24} color="#007AFF" />
//             <Text style={styles.exampleTitle}>{example.title}</Text>
//           </View>
//           <Text style={styles.exampleDescription}>{example.description}</Text>
//           <View style={styles.exampleFooter}>
//             <Text style={styles.difficulty}>{example.difficulty}</Text>
//             <Text style={styles.codeLanguage}>{example.code}</Text>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderPlayTab = () => {
//     const playContent = currentCourse.playContent;

//     return (
//       <View style={styles.playContainer}>
//         {playContent.map((content: PlayContent, index: number) => (
//           <View key={index} style={styles.playContentCard}>
//             <Text style={styles.playTitle}>{content.title}</Text>
//             <Text style={styles.playDescription}>{content.description}</Text>

//             {content.type === "editor" ? (
//               <View style={styles.editorContainer}>
//                 <WebView
//                   source={{ html: content.content as string }}
//                   style={styles.webview}
//                   javaScriptEnabled={true}
//                 />
//               </View>
//             ) : (
//               <View style={styles.quizContainer}>
//                 {!showScore ? (
//                   <>
//                     <Text style={styles.questionText}>
//                       {
//                         (content.content as QuizQuestion[])[
//                           currentQuestionIndex
//                         ].question
//                       }
//                     </Text>
//                     <View style={styles.optionsContainer}>
//                       {(content.content as QuizQuestion[])[
//                         currentQuestionIndex
//                       ].options.map((option, optionIndex) => (
//                         <TouchableOpacity
//                           key={optionIndex}
//                           style={styles.optionButton}
//                           onPress={() => handleQuizAnswer(optionIndex)}
//                         >
//                           <Text style={styles.optionText}>{option}</Text>
//                         </TouchableOpacity>
//                       ))}
//                     </View>
//                   </>
//                 ) : (
//                   <View style={styles.scoreContainer}>
//                     <Text style={styles.scoreText}>
//                       Your Score: {score} /{" "}
//                       {(content.content as QuizQuestion[]).length}
//                     </Text>
//                     <TouchableOpacity
//                       style={styles.resetButton}
//                       onPress={resetQuiz}
//                     >
//                       <Text style={styles.resetButtonText}>Try Again</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.content}>
//         <Text style={styles.title}>{currentCourse.title}</Text>
//         {/* <CourseTabs activeTab={activeTab} onTabPress={setActiveTab} /> */}

//         {activeTab === "learn" && renderLearnTab()}
//         {activeTab === "try" && renderTryTab()}
//         {activeTab === "play" && renderPlayTab()}
//       </ScrollView>

//       {selectedExample && (
//         <ExampleDialog
//           visible={showExampleDialog}
//           onClose={() => setShowExampleDialog(false)}
//           example={selectedExample}
//         />
//       )}

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
//                   uri: selectedContent.content,
//                   cache: true,
//                 }}
//               />
//             </View>
//           ) : selectedContent?.type === "video" ? (
//             <VideoPlayer
//               videoId={selectedContent.content}
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
//     backgroundColor: "#F2F2F7",
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#000",
//   },
//   chapterCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   chapterTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 12,
//   },
//   sectionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     backgroundColor: "#F2F2F7",
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   completedSection: {
//     backgroundColor: "#E8F5E9",
//   },
//   sectionInfo: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     color: "#000",
//   },
//   sectionDuration: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 2,
//   },
//   exampleCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   exampleHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   exampleTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#000",
//     marginLeft: 12,
//   },
//   exampleDescription: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 12,
//   },
//   exampleFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   difficulty: {
//     fontSize: 12,
//     color: "#FF9500",
//     fontWeight: "600",
//   },
//   codeLanguage: {
//     fontSize: 12,
//     color: "#666",
//   },
//   playContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   playTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 16,
//   },
//   editorContainer: {
//     backgroundColor: "#1E1E1E",
//     borderRadius: 8,
//     padding: 16,
//     height: 300,
//     marginBottom: 16,
//   },
//   editorPlaceholder: {
//     color: "#666",
//     fontSize: 14,
//   },
//   runButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#007AFF",
//     padding: 12,
//     borderRadius: 8,
//   },
//   runButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     flex: 1,
//     backgroundColor: "#fff",
//     marginTop: 40,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     overflow: "hidden",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E5EA",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#000",
//   },
//   closeButton: {
//     padding: 8,
//   },
//   modalScroll: {
//     flex: 1,
//   },
//   section: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E5EA",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   exampleImage: {
//     width: "100%",
//     height: 200,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   toolItem: {
//     backgroundColor: "#F2F2F7",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   toolName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 4,
//   },
//   toolDescription: {
//     fontSize: 14,
//     color: "#666",
//   },
//   stepItem: {
//     flexDirection: "row",
//     marginBottom: 12,
//   },
//   stepNumber: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#007AFF",
//     color: "#fff",
//     textAlign: "center",
//     lineHeight: 24,
//     marginRight: 12,
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   stepText: {
//     flex: 1,
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//   },
//   videoButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#007AFF",
//     padding: 12,
//     borderRadius: 8,
//   },
//   videoButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   closeButtonText: {
//     marginLeft: 8,
//     fontSize: 16,
//     fontFamily: "Inter_500Medium",
//     color: "#000",
//   },
//   playContentCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   playDescription: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 16,
//   },
//   webview: {
//     flex: 1,
//     height: 400,
//   },
//   quizContainer: {
//     padding: 16,
//   },
//   questionText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 20,
//   },
//   optionsContainer: {
//     gap: 12,
//   },
//   optionButton: {
//     backgroundColor: "#F2F2F7",
//     padding: 16,
//     borderRadius: 8,
//   },
//   optionText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   scoreContainer: {
//     alignItems: "center",
//     padding: 20,
//   },
//   scoreText: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 20,
//   },
//   resetButton: {
//     backgroundColor: "#007AFF",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   resetButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default IOTCourseScreen;

import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function IOTCourseScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>
        IOTCourseScreen {id}
      </Text>
    </View>
  );
}
