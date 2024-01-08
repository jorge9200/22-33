// components/Message.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Message = ({ text, isUser }) => {
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  botContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    fontSize: 16,
  },
});

export default Message;
