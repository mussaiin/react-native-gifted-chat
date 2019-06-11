/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from "prop-types";
import React from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  ViewPropTypes,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  Image
} from "react-native";

import Composer from "./Composer";
import Send from "./Send";
import Actions from "./Actions";
import Color from "./Color";

export default class InputToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.state = {
      position: "absolute",
      bottom: 0,
      height: 45
    };
  }

  updateTextFieldSize = (height) => {
    this.setState({
      height: this.state.height+30
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.renderResponder1 !== prevProps.renderResponder1) {
      const toolbarHeight = this.props.renderResponder1 ? 70 : 45;

      this.setState({
        height: toolbarHeight
      });
    }
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow(e) {
    let heightValue;

    if (
      Platform.OS === "ios" &&
      (Dimensions.get("window").height >= 812 ||
        Dimensions.get("window").width >= 812)
    ) {
      heightValue = 44 + 34;
    } else if (
      Platform.OS === "ios" &&
      (Dimensions.get("window").height <= 812 ||
        Dimensions.get("window").width <= 812)
    ) {
      heightValue = 44;
    }

    if (Platform.OS === "ios") {
      console.log(
        (e.endCoordinates ? e.endCoordinates.height : e.end.height) -
          heightValue
      );
      this.setState({
        bottom:
          (e.endCoordinates ? e.endCoordinates.height : e.end.height) -
          heightValue
      });
    }
  }

  keyboardWillHide() {
    this.setState({
      bottom: 0
    });
  }

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props} />;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return <Composer {...this.props} />;
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  renderResponder() {
    if (this.props.renderResponder1) {
      return (
        <View
          style={{
            paddingLeft: 35,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View style={{ flex: 8 }}>
            <Text
              style={{ paddingTop: 8, color: "grey", fontWeight: "500", fontSize: 13 }}
              numberOfLines={1}
            >
              Ответить: {this.props.renderResponder1}
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              paddingLeft: 10
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.handleCancelRepsonsePress();
              }}
            >
              <Image
                source={require("./assests/cross/Cross.png")}
                style={{ width: 12, height: 12, marginTop: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return;
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            position: this.state.position,
            bottom: this.state.bottom,
            height: this.state.height
          }
        ]}
      >
        {this.renderResponder()}
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
        </View>
        {this.renderSend()}
        {this.renderAccessory()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    marginLeft: 20,
    marginRight: 40,
    marginTop: 8,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EDEDED",
    paddingLeft: 5,
  },
  accessory: {
    height: 45
  }
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {}
};

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style
};
