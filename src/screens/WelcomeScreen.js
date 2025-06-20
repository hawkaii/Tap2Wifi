import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CivicAuthContext } from "../auth/CivicAuthContext";

const WelcomeScreen = ({ navigation }) => {
  const { user, signOut } = useContext(CivicAuthContext);

  const handleLogout = () => {
    signOut();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Welcome, {user?.name || "User"}!</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  email: { fontSize: 16, color: "#666", marginBottom: 20 },
});
