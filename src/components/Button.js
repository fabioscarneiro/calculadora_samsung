import React, { useState } from 'react'
import { View, StyleSheet, Vibration, Text, TouchableHighlight, useWindowDimensions, TouchableOpacity } from 'react-native'
import { colors } from '../styles'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";



export default props => {
    let { label, type } = props.values
    const [size, setSize] = useState(RFValue(29,778))
    const windowWidth = Math.round(useWindowDimensions().width) ;
    const windowHeight = Math.round(useWindowDimensions().height);
    const buttonIgual = label == '=' ? { backgroundColor: colors.backgroudigual } : {}
    const textGreen = type == 'operation' || type == 'percent' || type == 'parentes' ? { color: colors.textOperation } : {}
    const textClean = type == 'clean' ?  { color: colors.textClean } : {}

    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
      };

    function click() {
        ReactNativeHapticFeedback.trigger("keyboardTap", options);
        props.onClick(label, type)
    }

    return (
        <TouchableHighlight onPress={click} 
        style={[styles.botao, buttonIgual]} 
        underlayColor='#444444'
        onPressIn={()=>{setSize(RFValue(23,778))}}
        onPressOut={()=>{setSize(RFValue(29,778))}}
        >
            <View >
                <Text style={[styles.text, textGreen, textClean, {fontSize: size}]}>
                    {label}
                </Text>
            </View>
        </TouchableHighlight>

    )
}

const styles = StyleSheet.create({
    botao: {
        width: RFValue(75,778),
        height: RFValue(75,778),
        borderWidth: RFValue(1,778),
        borderColor: '#2c2c2c',
        justifyContent: 'center',
        alignItems: 'center',
        margin: RFValue(5,778),
        marginHorizontal: RFValue(10,778),
        backgroundColor: colors.backgroundButton,
        borderRadius: RFValue(37.5,778),
    },
    text: {
        color: colors.textButton,
        fontFamily: 'Roboto-Regular'
    },

})