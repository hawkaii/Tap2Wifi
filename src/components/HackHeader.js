import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const HackHeader = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hack Bor Bengal</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#2B2D42",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
