/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from "prop-types";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Image
} from "react-native";
import Color from "./Color";

export default function Send({
  text,
  containerStyle,
  onSend,
  children,
  textStyle,
  label,
  alwaysShowSend,
  disabled
}) {
  if (alwaysShowSend || text.trim().length > 0) {
    return (
      <TouchableOpacity
        testID="send"
        accessible
        accessibilityLabel="send"
        activeOpacity={0.9}
        style={[
          styles.container,
          containerStyle,
          {
            position: "absolute",
            width: 48,
            height: 48,
            backgroundColor: "#0347BA",
            borderRadius: 24,
            right: -14,
            top: -1,
            bottom: 1,
            justifyContent: "center",
            alignItems: "center"
          }
        ]}
        onPress={() => {
          onSend({ text: text.trim() }, true);
        }}
        accessibilityTraits="button"
        disabled={disabled}
      >
        <View>
          <Image
            source={require("./assests/chat/send-button.png")}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    );
  }
  return <View />;
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: "flex-end"
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: "600",
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10
  },
  image: {
    width: 21,
    height: 19
  }
});

Send.defaultProps = {
  text: "",
  onSend: () => {},
  label: "Send",
  containerStyle: {},
  textStyle: {},
  children: null,
  alwaysShowSend: false,
  disabled: false
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  children: PropTypes.element,
  alwaysShowSend: PropTypes.bool,
  disabled: PropTypes.bool
};
