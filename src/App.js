import React, { useState } from 'react'
import {
    SafeAreaView, StyleSheet, Text,
    View, FlatList, ToastAndroid, TouchableHighlight, NativeModules, Alert
} from 'react-native'
import { Display } from './components/Display'
import Icong from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Button from './components/Button'
import { colors } from './styles'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const locale = NativeModules.I18nManager.localeIdentifier
export default props => {
    const [display, setDisplay] = useState([])
    const [result, setResult] = useState('')
    const [key, setKey] = useState(0)
    const [nums, setNums] = useState({ num1: '', num2: '' })
    const [isnum2, setisnum2] = useState(false)
    const [calc, setCalc] = useState('')
    const [igual, setIgual] = useState(false)
    const [ultimoLabel, setUltimoLabel] = useState({ label: '', type: '' })
    const [ultimoOperation, setUltimoOperation] = useState('')


    let newArray = []
    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT)
    }
    
    let data = [
        { label: 'C', type: 'clean' },
        { label: '( )', type: 'parentes' },
        { label: '%', type: 'percent' },
        { label: '÷', type: 'operation' },
        { label: 7, type: 'numeric' },
        { label: 8, type: 'numeric' },
        { label: 9, type: 'numeric' },
        { label: 'X', type: 'operation' },
        { label: 4, type: 'numeric' },
        { label: 5, type: 'numeric' },
        { label: 6, type: 'numeric' },
        { label: '-', type: 'operation' },
        { label: 1, type: 'numeric' },
        { label: 2, type: 'numeric' },
        { label: 3, type: 'numeric' },
        { label: '+', type: 'operation' },
        { label: '+/-', type: 'operation+-' },
        { label: 0, type: 'numeric' },
        { label: ',', type: 'virgula' },
        { label: '=', type: 'igual' },
    ]

    const renderItem = ({ item }) => {
        return (
            <Button values={item} onClick={operation} />
        )
    }

    function operation(label, type) {
        let equa = calc
        const isOperation = type === 'operation'
        if (label == 'C') {
            clear()
            return
        }

        if (type == 'igual') {
            if (ultimoLabel.type == 'operation') {
                showToast('Formato usado inválido')
                return
            }
            finalResult()
            return
        }

        if (isOperation) {
            if (ultimoLabel.type == 'operation') {
                equa = calc.substring(0, calc.length - 1)
                insereDisplay(label, type)
            } else {
                if (igual) {
                    equa = Number(parseFloat(eval(calc)).toFixed(10)).toLocaleString(locale.replace('_', '-'))
                    setNums({ num1: equa })
                    setisnum2(true)
                    setIgual(false)
                    insereDisplay(label, type, true)
                } else {
                    if (isnum2) {
                        setisnum2(false)
                    }
                    else {
                        setisnum2(true)
                    }
                    insereDisplay(label, type)
                }
            }
            setCalc(equa + convertOperation(label))
        } else {
            if (igual) {
                clear()
                equa = ''
                setIgual(false)
            }
            if (isnum2) {

                if (type == 'percent') {
                    label = percent(nums.num1, nums.num2)
                    if (label == 'Erro') {
                        return
                    }
                    equa = equa.slice(0, equa.lastIndexOf(nums.num2))
                }

                if (type == 'operation+-'){
                    if (!equa){
                        label = '(-'
                    }else{
                        Alert.alert(nums.num2)
                        equa = equa.slice(0, equa.lastIndexOf(nums.num2))
                        return
                    }
                    
                }

                if (type == 'virgula') {
                    if (nums.num2.indexOf(',') > -1) {
                        return
                    } else {
                        if (nums.num2.length == 0) {
                            label = '0,'
                        }
                    }
                }
                if (nums.num2 == '0') {
                    if (label == '0') {
                        label = ''
                    }
                    else {
                        type = 'zero'
                    }
                }

                setNums({ num2: ultimoLabel.type == 'operation' ? label : nums.num2 + label.toString(), num1: nums.num1 })
            } else {
                if (type == 'percent') {
                    label = percent(nums.num2, nums.num1)
                    
                    if (label == 'Erro') {
                        return
                    }
                    equa = equa.slice(0, equa.lastIndexOf(nums.num1))
                }

                if (type == 'operation+-'){
                    if (!equa){
                        label = '(-'
                    }else{
                       label = '(-'
                        equa =  equa.slice(0, equa.lastIndexOf(nums.num1))
                        equa = equa + '-' + nums.num1
                    }
                }

                if (type == 'virgula') {
                    if (nums.num1.indexOf(',') > -1) {
                        return
                    } else {
                        if (nums.num1.length == 0) {
                            label = '0,'
                        }
                    }
                }
                if (nums.num1 == '0') {
                    if (label == '0') {
                        label = ''
                    }
                    else {
                        type = 'zero'
                    }
                }

                setNums({ num1: ultimoLabel.type == 'operation' ? label : nums.num1 + label.toString(), num2: nums.num2 })
            }
            if ((contemOperation() && !igual) || type == 'percent') {
                insereDisplayResult(equa + label.toString().replace(',', '.'))
            }
      
            setCalc(equa + label.toString().replace(',', '.'))
            insereDisplay(label, type)
        }
        setUltimoLabel({ label: label, type: type })
    }

    function clear() {
        setDisplay('')
        setResult('')
        setIgual(false)
        setKey(0)
        setCalc('')
        setNums({ num1: '', num2: '' })
        setisnum2(false)
    }

    function finalResult() {
        let number = Number(parseFloat(eval(calc)).toFixed(10)).toLocaleString('pt-BR')
        if (number == 'Infinity' || number == '∞') {
            showToast("Não é possível dividir por zero.")
            return
        }
        newArray.push(<Text style={[styles.number, { color: colors.textOperation }]} key={key}>{number}</Text>)
        setDisplay(newArray)
        setResult('')
        setIgual(true)
    }

    function insereDisplay(label, type, newCount) {
        if (newCount) {
            newArray = []
            newArray.push(
                <Text style={styles.number}
                    key={key}>{Number(parseFloat(eval(calc)).toFixed(10)).toLocaleString('pt-BR')}</Text>
            )
            setKey(key + 1)
        } else {
            newArray = [...display]
            if ((type == 'operation' && ultimoLabel.type == 'operation') || type == 'zero') {
                newArray.splice(newArray.length - 1, 1)
            } else {
                newArray = igual && type != 'operation' ? [] : [...newArray]
            }
        }

        newArray.push(
            <Text style={(type == 'operation' || type == 'percent') ? styles.operation : styles.number}
                key={key + 1}>{type == 'percent' ? '%' : label}</Text>
        )
        setKey(key + 1)
        setDisplay(newArray)
    }

    function insereDisplayResult(value) {
        let number = Number(parseFloat(eval(value)).toFixed(10))
        if (number == 'Infinity') {
            return
        }
        const resultado = <Text style={styles.textResult}> {number.toLocaleString('pt-BR')}</Text>
        setResult(resultado)
    }

    function contemOperation() {
        let contem = calc.search(/[/%*+-]/i) > -1
        return contem
    }

    function convertOperation(operation) {
        switch (operation) {
            case '÷':
                operation = '/'
                break;
            case 'X':
                operation = '*'
                break;
            default:
                operation
                break;
        }
        setUltimoOperation(operation)
        return operation
    }

    function percent(value, vpercent) {
        if (!value && !vpercent) {
            showToast('Formato usado inválido')
            return 'Erro'
        } else {
            if ((ultimoOperation != '*' && ultimoOperation != '/') && value)
                return (((vpercent / 100) *  value.toString().replace(',', '.')))
            else{
                return vpercent/100
            }
                
        }
    }

 

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 }}>
                    <Display value={display} />
                </View>
                <View style={{ flex: 1 }}>
                    <Display value={result} />
                </View>
            </View>

            <View style={styles.tools}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                    <TouchableHighlight>
                        <Icon name="clock-time-three-outline" size={25} color="#959595" />
                    </TouchableHighlight>
                    <TouchableHighlight>
                        <Icong name="straighten" size={23} color="#959595" />
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableHighlight>
                        <Icon name="backspace-outline" size={23} color="#7da94d" />
                    </TouchableHighlight>
                </View>
            </View>

            <View style={styles.button}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.label}
                    numColumns={4}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    button: {
        marginHorizontal: RFValue(20, 778),
        marginBottom: RFValue(5, 778),
        alignItems: 'center'
    },
    number: {
        color: '#fafafa',
        fontSize: RFValue(40, 778),
        paddingVertical: RFValue(5, 778),
        fontFamily: 'Roboto-Light'
    },
    operation: {
        color: '#7fac4d',
        fontSize: RFValue(25, 778),
        paddingVertical: RFValue(5, 778),
        fontFamily: 'Roboto-Light'
    },
    textResult: {
        fontSize: RFValue(23, 778),
        color: '#555555',
        fontFamily: 'Roboto-Light'
    },
    tools: {
        flexDirection: 'row',
        marginBottom: RFValue(25, 778),
        marginHorizontal: 17,
        borderBottomWidth: 1,
        borderBottomColor: '#212121',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 45,
        paddingBottom: 25
    }

})
