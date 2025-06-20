import React, { useContext } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { CivicAuthContext } from "../auth/CivicAuthContext";

const LoginScreen = ({ navigation }) => {
  const { signIn, state } = useContext(CivicAuthContext);

  if (state.isAuthenticated) {
    navigation.replace("Welcome");
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hack Bor Bengal</Text>
      <Button title="Login with Civic" onPress={() => signIn()} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
});
