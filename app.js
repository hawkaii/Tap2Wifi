import React from "react";
import { CivicAuthProvider } from "./auth/CivicAuthContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <CivicAuthProvider>
      <AppNavigator />
    </CivicAuthProvider>
  );
}
