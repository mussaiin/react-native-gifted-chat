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
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: "#00246B",
                        position: "absolute",
                        right: 15,
                        bottom: 4,
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
        height: 30,
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
        width: 15,
        height: 14
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
