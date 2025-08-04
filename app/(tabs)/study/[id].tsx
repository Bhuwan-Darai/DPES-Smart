import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { GET_SCHOOL_CURRICULUM_LESSON_PLAN } from "@/lib/hooks/graphql/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";

interface LessonPlanMaterial {
  materialId: string;
  title?: string;
  content?: string;
  type?: string;
}

interface LessonPlan {
  lessonPlanId: string;
  learningObjective: string[];
  duration?: string;
  activities: string[];
  teachingStartDate?: string;
  teachingEndDate?: string;
  teachingMethod: string[];
  assessment: string[];
  homework: string[];
  materials?: LessonPlanMaterial[];
  createdAt: string;
}

interface CurriculumNode {
  curriculumId: string;
  name: string;
  parentId: string | null;
  level: number;
  visible: boolean;
  createdAt: string;
  lessonPlan?: LessonPlan[];
  children?: CurriculumNode[];
}

interface CurriculumHeader {
  headerId: string;
  header: string;
  parentCurriculum: CurriculumNode[];
  childCurriculum: CurriculumNode[];
  lessonPlan: LessonPlan[];
}

export default function StudyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedLessonPlan, setSelectedLessonPlan] =
    useState<LessonPlan | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_SCHOOL_CURRICULUM_LESSON_PLAN, {
    variables: { subjectId: id },
    skip: !id,
  });

  // Function to show lesson plan modal
  const showLessonPlanModal = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
    setIsModalVisible(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedLessonPlan(null);
  };

  // Function to build tree structure
  const buildCurriculumTree = (
    parentCurriculum: CurriculumNode[],
    childCurriculum: CurriculumNode[]
  ): CurriculumNode[] => {
    const nodeMap = new Map<string, CurriculumNode>();

    // Add all parent curriculum items to the map
    parentCurriculum.forEach((item) => {
      nodeMap.set(item.curriculumId, { ...item, children: [] });
    });

    // Add all child curriculum items to the map
    childCurriculum.forEach((item) => {
      nodeMap.set(item.curriculumId, { ...item, children: [] });
    });

    // Build the tree structure
    const rootNodes: CurriculumNode[] = [];

    nodeMap.forEach((node) => {
      if (node.parentId === null) {
        // This is a root node
        rootNodes.push(node);
      } else {
        // This is a child node, add it to its parent
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        }
      }
    });

    return rootNodes;
  };

  // Function to toggle node expansion
  const toggleNode = (curriculumId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(curriculumId)) {
      newExpanded.delete(curriculumId);
    } else {
      newExpanded.add(curriculumId);
    }
    setExpandedNodes(newExpanded);
  };

  // Component to render lesson plan details
  const renderLessonPlan = (plan: LessonPlan, index: number) => {
    return (
      <View key={plan.lessonPlanId} style={styles.lessonPlanItem}>
        <View style={styles.lessonPlanHeader}>
          <View style={styles.lessonPlanHeaderContent}>
            <Text style={styles.lessonPlanName}>Lesson Plan {index + 1}</Text>
          </View>

          <View style={styles.lessonPlanHeaderRight}>
            {plan.duration && (
              <Text style={styles.lessonPlanDuration}>
                Duration: {plan.duration}
              </Text>
            )}
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => showLessonPlanModal(plan)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Component to render lesson plan modal
  const renderLessonPlanModal = () => {
    if (!selectedLessonPlan) return null;

    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lesson Plan Details</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Learning Objectives */}
              {selectedLessonPlan.learningObjective &&
                selectedLessonPlan.learningObjective.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      Learning Objectives
                    </Text>
                    {selectedLessonPlan.learningObjective.map(
                      (objective, idx) => (
                        <Text key={idx} style={styles.modalSectionText}>
                          • {objective}
                        </Text>
                      )
                    )}
                  </View>
                )}

              {/* Duration */}
              {selectedLessonPlan.duration && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Duration</Text>
                  <Text style={styles.modalSectionText}>
                    {selectedLessonPlan.duration}
                  </Text>
                </View>
              )}

              {/* Activities */}
              {selectedLessonPlan.activities &&
                selectedLessonPlan.activities.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Activities</Text>
                    {selectedLessonPlan.activities.map((activity, idx) => (
                      <Text key={idx} style={styles.modalSectionText}>
                        • {activity}
                      </Text>
                    ))}
                  </View>
                )}

              {/* Teaching Methods */}
              {selectedLessonPlan.teachingMethod &&
                selectedLessonPlan.teachingMethod.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      Teaching Methods
                    </Text>
                    {selectedLessonPlan.teachingMethod.map((method, idx) => (
                      <Text key={idx} style={styles.modalSectionText}>
                        • {method}
                      </Text>
                    ))}
                  </View>
                )}

              {/* Assessment */}
              {selectedLessonPlan.assessment &&
                selectedLessonPlan.assessment.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Assessment</Text>
                    {selectedLessonPlan.assessment.map((assessment, idx) => (
                      <Text key={idx} style={styles.modalSectionText}>
                        • {assessment}
                      </Text>
                    ))}
                  </View>
                )}

              {/* Homework */}
              {selectedLessonPlan.homework &&
                selectedLessonPlan.homework.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Homework</Text>
                    {selectedLessonPlan.homework.map((hw, idx) => (
                      <Text key={idx} style={styles.modalSectionText}>
                        • {hw}
                      </Text>
                    ))}
                  </View>
                )}

              {/* Materials */}
              {selectedLessonPlan.materials &&
                selectedLessonPlan.materials.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Materials</Text>
                    {selectedLessonPlan.materials.map((material, idx) => (
                      <View
                        key={material.materialId}
                        style={styles.modalMaterialItem}
                      >
                        <Text style={styles.modalMaterialTitle}>
                          {material.title || `Material ${idx + 1}`}
                        </Text>
                        <Text style={styles.modalMaterialType}>
                          Type: {material.type}
                        </Text>
                        {material.content && (
                          <Text style={styles.modalMaterialContent}>
                            {material.content}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

              {/* Dates */}
              {(selectedLessonPlan.teachingStartDate ||
                selectedLessonPlan.teachingEndDate) && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Teaching Period</Text>
                  {selectedLessonPlan.teachingStartDate && (
                    <Text style={styles.modalSectionText}>
                      Start:{" "}
                      {new Date(
                        selectedLessonPlan.teachingStartDate
                      ).toLocaleDateString()}
                    </Text>
                  )}
                  {selectedLessonPlan.teachingEndDate && (
                    <Text style={styles.modalSectionText}>
                      End:{" "}
                      {new Date(
                        selectedLessonPlan.teachingEndDate
                      ).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Recursive component to render tree nodes
  const renderTreeNode = (node: CurriculumNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.curriculumId);
    const hasChildren = node.children && node.children.length > 0;
    const hasLessonPlans = node.lessonPlan && node.lessonPlan.length > 0;

    return (
      <View key={node.curriculumId} style={styles.nodeContainer}>
        <TouchableOpacity
          style={[styles.nodeItem, { paddingLeft: 16 + depth * 20 }]}
          onPress={() => toggleNode(node.curriculumId)}
        >
          <View style={styles.nodeContent}>
            {(hasChildren || hasLessonPlans) && (
              <Text style={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</Text>
            )}
            <View style={styles.nodeInfo}>
              <Text style={styles.nodeName}>{node.name}</Text>
              <Text style={styles.nodeLevel}>Level: {node.level}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.childrenContainer}>
            {/* Render lesson plans for this curriculum */}
            {hasLessonPlans && (
              <View style={styles.curriculumLessonPlans}>
                <Text style={styles.curriculumLessonPlansTitle}>
                  Lesson Plans:
                </Text>
                {node.lessonPlan?.map((plan, index) =>
                  renderLessonPlan(plan, index)
                )}
              </View>
            )}

            {/* Render child nodes */}
            {hasChildren &&
              node.children &&
              node.children.map((child) => renderTreeNode(child, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading curriculum...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error loading curriculum: {error.message}
        </Text>
      </View>
    );
  }

  const curriculumData: CurriculumHeader[] =
    data?.getSchoolCurriculumLessonPlan || [];

  return (
    <ScrollView style={styles.container}>
      {!curriculumData || curriculumData.length === 0 ? (
        <Text style={styles.noDataText}>
          No curriculum yet, please be patient.
        </Text>
      ) : (
        curriculumData.map((header) => {
          const curriculumTree = buildCurriculumTree(
            header.parentCurriculum,
            header.childCurriculum
          );

          return (
            <View key={header.headerId} style={styles.headerContainer}>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>{header.header}</Text>
              </View>

              <View style={styles.treeContainer}>
                <Text style={styles.treeTitle}>Curriculum Structure:</Text>
                {curriculumTree.length > 0 ? (
                  curriculumTree.map((node) => renderTreeNode(node))
                ) : (
                  <Text style={styles.noDataText}>
                    No curriculum data available
                  </Text>
                )}
              </View>

              {header.lessonPlan.length > 0 && (
                <View style={styles.lessonPlanContainer}>
                  <Text style={styles.lessonPlanTitle}>
                    Header Lesson Plans:
                  </Text>
                  {header.lessonPlan.map((plan, index) =>
                    renderLessonPlan(plan, index)
                  )}
                </View>
              )}
            </View>
          );
        })
      )}

      {/* Render the modal */}
      {renderLessonPlanModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: "red",
  },
  headerContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerInfo: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerId: {
    fontSize: 12,
    color: "#666",
  },
  treeContainer: {
    marginBottom: 16,
  },
  treeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  nodeContainer: {
    marginBottom: 4,
  },
  nodeItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 12,
  },
  nodeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandIcon: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
    width: 16,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  nodeLevel: {
    fontSize: 12,
    color: "#666",
  },
  childrenContainer: {
    marginTop: 4,
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  lessonPlanContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 16,
  },
  lessonPlanTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  lessonPlanItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  lessonPlanHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonPlanHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  lessonPlanName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginRight: 8,
  },
  lessonPlanDuration: {
    fontSize: 12,
    color: "#666",
  },
  curriculumLessonPlans: {
    marginTop: 16,
    marginBottom: 16,
  },
  curriculumLessonPlansTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  lessonPlanHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewDetailsButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  viewDetailsButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(245, 245, 244, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  modalMaterialItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  modalMaterialTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  modalMaterialType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  modalMaterialContent: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 16,
  },
});
