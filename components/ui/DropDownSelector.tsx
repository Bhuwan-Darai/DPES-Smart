import { useState } from "react";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";

const DropdownSelector = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 8,
          color: "#374151",
        }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          padding: 12,
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: value ? "#1F2937" : "#9CA3AF" }}>
          {value || placeholder}
        </Text>
        <Text style={{ color: "#6B7280" }}>▼</Text>
      </TouchableOpacity>
      {isOpen && (
        <View
          style={{
            position: "absolute",
            top: 70,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            maxHeight: 200,
            zIndex: 1000,
          }}
        >
          <ScrollView>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <Text style={{ color: "#1F2937" }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DropdownSelector;
