import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ACCESS_TOKEN_KEY } from "./web/src/shared/constants";
export default function App() {
  return (
    <View style={styles.container}>
      <Text>{`Try to access ACCESS_TOKEN_KEY from web folder as ${ACCESS_TOKEN_KEY}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
