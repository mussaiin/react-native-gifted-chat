/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, View, ViewPropTypes } from "react-native";
import moment from "moment";

import Color from "./Color";

import { isSameDay } from "./utils";
import { DATE_FORMAT } from "./Constant";

export default function Day(
    {
        dateFormat,
        currentMessage,
        previousMessage,
        nextMessage,
        containerStyle,
        wrapperStyle,
        textStyle,
        inverted
    },
    context
) {
    if (!isSameDay(currentMessage, inverted ? previousMessage : nextMessage)) {
        return (
            <View style={[styles.container, containerStyle]}>
                <View style={wrapperStyle}>
                    <Text style={[styles.text, textStyle]}>
                        {moment(currentMessage.createdAt)
                            .locale("ru")
                            .format(dateFormat)}
                    </Text>
                </View>
            </View>
        );
    }
    return null;
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        alignSelf: "center",
        borderRadius: 20,
        backgroundColor: "#6490D54D",
        paddingVertical: 5,
        marginTop: 5,
        marginBottom: 10
    },
    text: {
        backgroundColor: Color.backgroundTransparent,
        color: "#5D6D8180",
        fontSize: 12,
        fontWeight: "400"
    }
});

Day.contextTypes = {
    getLocale: PropTypes.func
};

Day.defaultProps = {
    currentMessage: {
        // TODO: test if crash when createdAt === null
        createdAt: null
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    dateFormat: DATE_FORMAT
};

Day.propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    dateFormat: PropTypes.string
};
