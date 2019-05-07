/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from "prop-types";
import React from "react";
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  TouchableOpacity,
  Image
} from "react-native";

import MessageText from "./MessageText";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";

import Time from "./Time";
import Color from "./Color";

import { isSameUser, isSameDay } from "./utils";

export default class Bubble extends React.Component {
  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else if (this.props.currentMessage.text) {
      const options =
        this.props.optionTitles.length > 0
          ? this.props.optionTitles.slice(0, 2)
          : ["Скопировать", "Отмена"];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
            default:
              break;
          }
        }
      );
    }
  };

  handleBubbleToNext() {
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToNext,
        this.props.containerToNextStyle[this.props.position]
      ]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToPrevious,
        this.props.containerToPreviousStyle[this.props.position]
      ]);
    }
    return null;
  }

  renderReplyMessageText() {
    const { currentMessage, user } = this.props;
    const { replyMessage } = currentMessage;

    const isUserMessageOwner =
      currentMessage.user._id === user._id ? true : false;

    if (!replyMessage) {
      return;
    }

    return (
      <View style={styles.replyMessageContainer}>
        <View
          style={[
            styles.replyMessageBorder,
            { backgroundColor: isUserMessageOwner ? "white" : "#2F75EC" }
          ]}
        />
        <Text
          style={[
            styles.replyMessageTitle,
            { color: isUserMessageOwner ? "white" : "black" }
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {replyMessage}
        </Text>
      </View>
    );
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} />;
    }
    return null;
  }

  renderMessageVideo() {
    if (this.props.currentMessage.video) {
      const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
      if (this.props.renderMessageVideo) {
        return this.props.renderMessageVideo(messageVideoProps);
      }
      return <MessageVideo {...messageVideoProps} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (
      currentMessage.sent ||
      currentMessage.received ||
      currentMessage.pending
    ) {
      return (
        <View style={styles.tickView}>
          {currentMessage.sent && (
            <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>
          )}
          {currentMessage.received && (
            <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>
          )}
          {currentMessage.pending && (
            <Text style={[styles.tick, this.props.tickStyle]}>🕓</Text>
          )}
        </View>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }

  renderUsername() {
    const { currentMessage } = this.props;
    if (this.props.renderUsernameOnMessage) {
      if (currentMessage.user._id === this.props.user._id) {
        return (
          <View style={styles.usernameView}>
            <Text
              style={[
                styles.username,
                this.props.usernameStyle,
                { color: "white", fontSize: 14, fontWeight: "bold" }
              ]}
            >
              Вы
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.usernameView}>
          <Text
            style={[
              styles.username,
              this.props.usernameStyle,
              { color: "#2F75EC", fontWeight: "bold", fontSize: 14 }
            ]}
          >
            {currentMessage.user.name}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  renderResponseText() {
    const { responseToMessage } = this.props;

    if (this.props.currentMessage.user._id === this.props.user._id) {
      return (
        <TouchableOpacity
          onPress={() => {
            responseToMessage(this.props.currentMessage);
          }}
          style={{
            flexDirection: "row",
            paddingLeft: 12,
            alignItems: "center",
            marginTop: 8
          }}
        >
          <Image
            source={require("./assests/reply/white-Reply.png")}
            style={{ width: 16, height: 14 }}
          />
          <Text style={[{ color: "#FFFFFF99", fontSize: 12, marginLeft: 8 }]}>
            ответить
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => {
          responseToMessage(this.props.currentMessage);
        }}
        style={{
          flexDirection: "row",
          paddingLeft: 12,
          alignItems: "center",
          marginTop: 8
        }}
      >
        <Image
          source={require("./assests/reply/Reply.png")}
          style={{ width: 16, height: 14 }}
        />
        <Text style={[{ color: "#ACACAC66", fontSize: 12, marginLeft: 8 }]}>
          ответить
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position]
        ]}
      >
        <View
          style={[
            styles[this.props.position].wrapper,
            this.props.wrapperStyle[this.props.position],
            this.handleBubbleToNext(),
            this.handleBubbleToPrevious()
          ]}
        >
          <TouchableWithoutFeedback
            onLongPress={this.onLongPress}
            accessibilityTraits="text"
            {...this.props.touchableProps}
          >
            <View style={{ paddingBottom: 14 }}>
              <View
                style={[
                  styles[this.props.position].bottom,
                  this.props.bottomContainerStyle[this.props.position],
                  {
                    paddingTop: 14,
                    alignItems: "center",
                    justifyContent: "space-between"
                  }
                ]}
              >
                {this.renderUsername()}
                {this.renderTime()}
                {/* {this.renderTicks()} */}
              </View>
              {this.renderCustomView()}
              {this.renderMessageImage()}
              {this.renderMessageVideo()}
              {this.renderReplyMessageText()}
              {this.renderMessageText()}
              {this.renderResponseText()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "flex-start"
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: "#19315B1A",
      marginRight: 60,
      minHeight: 20,
      justifyContent: "flex-end"
    },
    containerToNext: {
      borderBottomLeftRadius: 3
    },
    containerToPrevious: {
      borderTopLeftRadius: 3
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "flex-start"
    }
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "flex-end"
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: "#397FD2",
      marginLeft: 60,
      minHeight: 20,
      justifyContent: "flex-end"
    },
    containerToNext: {
      borderBottomRightRadius: 3
    },
    containerToPrevious: {
      borderTopRightRadius: 3
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "flex-end"
    }
  }),
  tick: {
    fontSize: 10,
    backgroundColor: Color.backgroundTransparent,
    color: Color.white
  },
  tickView: {
    flexDirection: "row",
    marginRight: 10
  },
  username: {
    top: -3,
    left: 0,
    fontSize: 12,
    backgroundColor: "transparent",
    color: "#aaa"
  },
  usernameView: {
    flexDirection: "row",
    marginHorizontal: 10
  },
  replyMessageContainer: {
    flexDirection: "row",
    paddingLeft: 10,
    marginVertical: 5,
    paddingRight: 16,
    alignItems: "center"
  },
  replyMessageBorder: {
    height: 30,
    width: 3
  },
  replyMessageTitle: {
    paddingLeft: 8,
    fontSize: 16
  }
};

Bubble.contextTypes = {
  actionSheet: PropTypes.func
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageVideo: null,
  renderMessageText: null,
  renderCustomView: null,
  renderUsername: null,
  renderTicks: null,
  renderTime: null,
  position: "left",
  optionTitles: ["Скопировать", "Отмена"],
  currentMessage: {
    text: null,
    createdAt: null,
    image: null
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  bottomContainerStyle: {},
  tickStyle: {},
  usernameStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {}
};

Bubble.propTypes = {
  user: PropTypes.object.isRequired,
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageVideo: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderUsernameOnMessage: PropTypes.bool,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  position: PropTypes.oneOf(["left", "right"]),
  optionTitles: PropTypes.arrayOf(PropTypes.string),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  bottomContainerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  tickStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  })
};
