import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

interface PreviousLoginsProps {
  onSelectAccount: (email: string) => void;
  onAddNewAccount: () => void;
}

export const PreviousLogins: React.FC<PreviousLoginsProps> = ({
  onSelectAccount,
  onAddNewAccount,
}) => {
  const { savedCredentials, removeSavedCredential } = useAuth();

  const renderItem = ({ item }: { item: { email: string; name: string; lastLogin: string } }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => onSelectAccount(item.email)}
    >
      <View style={styles.accountInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeSavedCredential(item.email)}
      >
        <Ionicons name="close-circle-outline" size={24} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose an Account</Text>
      <FlatList
        data={savedCredentials}
        renderItem={renderItem}
        keyExtractor={(item) => item.email}
        style={styles.list}
      />
      <TouchableOpacity
        style={styles.addAccountButton}
        onPress={onAddNewAccount}
      >
        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.addAccountText}>Add Another Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  accountInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 5,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 10,
  },
  addAccountText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
}); 