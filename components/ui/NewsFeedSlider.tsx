import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface NewsFeedImageSliderProps {
  images: string[];
}

const NewsFeedImageSlider: React.FC<NewsFeedImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <View style={styles.noImagesContainer}>
        <Text style={styles.noImagesText}>No images to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Image Display */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: images[currentIndex] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={handlePrev}
                style={[styles.navButton, styles.prevButton]}
                activeOpacity={0.7}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
            )}
            {currentIndex < images.length - 1 && (
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.navButton, styles.nextButton]}
                activeOpacity={0.7}
              >
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Dot Indicators */}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot
              ]}
              activeOpacity={0.7}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  
  },
  noImagesContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noImagesText: {
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    overflow: 'hidden',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 25,
    zIndex: 10,
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#2563eb', // blue-600
  },
  inactiveDot: {
    backgroundColor: '#d1d5db', // gray-300
  },
});

export default NewsFeedImageSlider;