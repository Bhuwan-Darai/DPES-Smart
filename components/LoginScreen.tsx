import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoginScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <TextInput placeholder="Email" style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '80%' }} />
      <TextInput placeholder="Password" secureTextEntry style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '80%' }} />
      <Button title="Login" onPress={() => {}} />
    </View>
  );
};

export default LoginScreen; 