import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ variant = 'Primary', text, onPress, style }) {
  const backgroundColor = variant === 'Primary' ? '#FF5A5F' : '#3498DB';
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor }, style]}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 12, borderRadius: 8 },
  text: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }
});
