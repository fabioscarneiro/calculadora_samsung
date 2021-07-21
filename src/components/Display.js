import React, { useState } from 'react'
import { TextInput, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, Text } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export function Display({ value }) {

    return (
        <View pointerEvents='none'>
            <TextInput
                style={styles.input}
            >
                {value}
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        textAlign: 'right',
        marginRight: RFValue(25,778),
    }
})