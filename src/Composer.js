/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Platform, StyleSheet, TextInput, View, Text } from "react-native";

import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from "./Constant";
import Color from "./Color";

export default class Composer extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      height: 20
    }
  }
   onContentSizeChange(e) {
      const {contentSize} = e.nativeEvent;
      // Support earlier versions of React Native on Android.
      if (!contentSize) return;
      if (
        !this.contentSize ||
        this.contentSize.width !== contentSize.width ||
        this.contentSize.height !== contentSize.height
      ) {
        this.contentSize = contentSize;
        if(contentSize.height<80){
          this.setState({ height: contentSize.height })
          this.props.handleComposerSizeChange(contentSize);
        }
      }
  }
  componentDidUpdate(){
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  render() {
    return (
      <View style={[styles.primary]}>
        <TextInput
          testID={this.props.placeholder}
          accessible
          accessibilityLabel={this.props.placeholder}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          secureTextEntry={false}
          onChange={e => this.onContentSizeChange(e)}
          onContentSizeChange={e => this.onContentSizeChange(e)}
          onChangeText={text => this.onChangeText(text)}
          style={[
            styles.textInput,
            this.props.textInputStyle,
            { height: this.state.height }
          ]}
          autoFocus={this.props.textInputAutoFocus}
          value={this.props.text}
          enablesReturnKeyAutomatically
          underlineColorAndroid="transparent"
          keyboardAppearance={this.props.keyboardAppearance}
          {...this.props.textInputProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
    marginHorizontal: 10,
    marginVertical: 5,
    flex: 1,
    justifyContent: "center",
  },
  primary: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    marginLeft: 20,
    marginRight: 60,
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
});

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: "",
  placeholderTextColor: Color.defaultProps,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: "default",
  onTextChanged: () => {},
  onInputSizeChanged: () => {}
};

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string
};
