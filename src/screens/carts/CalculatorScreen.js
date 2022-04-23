import React from "react";
import { View, Text } from "react-native";
import { Calculator } from "react-native-calculator";
import { Header } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { withNavigation } from "react-navigation";

const CalculatorScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        placement="center"
        containerStyle={{
          backgroundColor: "#2E7C31",
        }}
        rightComponent={{
          icon: "close",
          color: "#fff",
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: "Calculator",
          style: { color: "#fff", fontSize: 18, fontWeight: "bold" },
        }}
      />
      <Calculator style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

export default withNavigation(CalculatorScreen)