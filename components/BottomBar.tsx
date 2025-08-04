import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Home, Book, FileText, FileCheck2, Menu } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const BottomBar = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const menuItems = [
    { id: 0, icon: Home, component: 'dashStudentMobileHome', label: 'Home' },
    {
      id: 1,
      icon: Book,
      component: 'dashStudentMobileCourse',
      label: 'Study',
    },
    {
      id: 2,
      icon: FileText,
      component: 'dashStudentMobileMaterial',
      label: 'Materials',
    },
    {
      id: 3,
      icon: FileCheck2,
      component: 'dashStudentMobileExam',
      label: 'Exam',
    },
    {
      id: 4,
      icon: Menu,
      component: 'dashStudentMobileMenu',
      label: 'Menu',
    },
  ];

  const getDepressionPath = (index: number) => {
    const itemWidth = width / 5;
    const startX = itemWidth * index + itemWidth / 2; // Center the depression
    const curveHeight = 30; // Reduce height for a more subtle effect
    const curveWidth = 100; // Control width of depression

    return `
      M0,60 
      H${startX - curveWidth} 
      C${startX - curveWidth / 2},60 ${startX - curveWidth / 4},${60 + curveHeight} ${startX},${60 + curveHeight}
      C${startX + curveWidth / 4},${60 + curveHeight} ${startX + curveWidth / 2},60 ${startX + curveWidth},60
      H${width}
      V260 H0 Z
    `;
};

  const handleSelectComponent = (item: typeof menuItems[number]) => {
    setSelectedTab(item.id);
    // Add your navigation or state update logic here
    // For example:
    // navigation.navigate(item.component);
    // or
    // setCurrentComponent(item.component);
  };

  return (
    <View style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: 100 
    }}>
      <Svg 
        width={width} 
        height={150} 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          shadowColor: '#000',
        //   shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
        //   shadowRadius: 8,
        }}
      >
        <Path 
          d={getDepressionPath(selectedTab)} 
          fill="#ffffff" 
        />
        <Path 
          d={getDepressionPath(selectedTab)} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth={1} 
        />
      </Svg>

      <View style={{ 
        flexDirection: 'row', 
        height: '100%', 
        paddingTop: 10 
      }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isSelected = selectedTab === i;

          return (
            <TouchableOpacity 
              key={i}
              onPress={() => handleSelectComponent(item)}
              style={{ 
                flex: 1, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <View style={[
                { 
                  position: 'absolute',
                  padding: 12,
                  borderRadius: 99,
                  top: isSelected ? -12 : 0,
                },
                isSelected 
                  ? { 
                      backgroundColor: '#3b82f6', 
                      transform: [{ translateY: -12 }] 
                    }
                  : { 
                      backgroundColor: 'transparent',
                      transform: [{ translateY: 0 }]
                    }
              ]}>
                <Icon 
                  size={24} 
                  color={isSelected ? 'white' : '#4b5563'} 
                  strokeWidth={2} 
                />
              </View>
              <Text 
                style={[
                  { 
                    position: 'absolute', 
                    bottom: 16, 
                    fontSize: 14, 
                    fontWeight: '500' 
                  },
                  { 
                    color: isSelected ? '#3b82f6' : '#4b5563' 
                  }
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomBar;