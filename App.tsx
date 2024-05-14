/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
    Dimensions, FlatList, LayoutAnimation,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text, TouchableOpacity,
    useColorScheme,
    View, Animated
} from 'react-native';
import WebDisplay from "./WebDisplay";
import AntDesign from "react-native-vector-icons/AntDesign";



function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const [stocksList, setStocksList] = React.useState([])
    const [updatedHeight, setUpdatedHeight] = React.useState(80)
    const [expand, setExpand] = React.useState(false)
    const animatedController = useRef(new Animated.Value(0)).current;


    const arrowAngle = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: ["0rad", `${Math.PI}rad`],
    });

    const backgroundStyle = {
        backgroundColor: 'white',
    };

    useEffect(() => {
        const options = {method: 'GET'};
        fetch('https://run.mocky.io/v3/bde7230e-bc91-43bc-901d-c79d008bddc8', options)
            .then(response => response.json())
            .then(data => {setStocksList(data.userHolding)})
            .catch(error => console.error(error));
    }, []);

    function getProfitLossValue(item){
        return ((item.ltp * item.quantity) - (item.avgPrice * item.quantity)).toFixed(2);
    }

    function _renderStocksList(item, index) {
        return(
            <View style={{padding: 20, paddingBottom: 0}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>{item.symbol}</Text>
                    <WebDisplay source={{html: getLTPValue(item.ltp.toFixed(2))}} baseFontStyle={{color: 'black'}} imagesMaxWidth={Dimensions.get('window').width}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
                    <Text style={{color: 'black'}}>{item.quantity}</Text>
                    <WebDisplay source={{html: getPLValue(getProfitLossValue(item))}} baseFontStyle={{color: 'black'}} imagesMaxWidth={Dimensions.get('window').width}/>
                </View>
                <View style={{backgroundColor: '#dadada', height: 0.5, width: "100%", marginTop: 12}}/>
            </View>
        )
    }

    function getLTPValue(price){
        return `<p>LTP: <b>₹ ${price}</b></p>`
    }

    function getPLValue(price){
        return `<p>P/L: <b>₹ ${price}</b></p>`
    }

    function onPressProfitLoss() {
        LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut);
        if(!expand) {
            setUpdatedHeight(180)
            setExpand(true)
        } else {
            setUpdatedHeight(80)
            setExpand(false)
        }
    }

    function renderProfitAndLoss(){
        return(
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: "90%"}}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>{"Profit & Loss"}</Text>
                <Text style={{ color: 'black'}}>₹ {(getCurrentValue() - getInvestmentValue()).toFixed(2)}</Text>
            </View>
        )
    }

    function getCurrentValue(){
        if(stocksList.length > 0){
            return stocksList.reduce((a,v) =>  a = a + (v.ltp * v.quantity) , 0 )
        }
        return 0
    }

    function getInvestmentValue(){
        if(stocksList.length > 0){
            return stocksList.reduce((a,v) =>  a = a + (v.avgPrice * v.quantity) , 0 )
        }
        return 0
    }

    function getTodaysProfitAndLoss(){
        if(stocksList.length > 0){
            return stocksList.reduce((a,v) =>  a = a + ((v.close - v.ltp) * v.quantity) , 0 )
        }
        return 0
    }

    function renderDetailRow(label, value, isLast = false) {
        return (
            <View style={[styles.rowCommonStyle, { marginBottom: isLast ? 24 : 8 }]}>
                <Text style={styles.boldText}>{label}</Text>
                <Text style={{ color: 'black' }}>₹ {value}</Text>
            </View>
        );
    }

  return (
    <SafeAreaView style={{flex: 1}}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <View style={{backgroundColor: '#75147C'}}>
            <Text style={{fontSize: 18, color: "white", marginHorizontal: 20, marginVertical: 12}}>Upstox Holding</Text>
          </View>
        <FlatList
            contentContainerStyle={{flexGrow: 1}}
            data={stocksList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => _renderStocksList(item, index)}
        />
        <View style={[{flex: 1,position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', width: '100%',
            backgroundColor: "white", borderTopLeftRadius: 12, borderTopRightRadius: 12, height: updatedHeight, borderTopWidth: 6,
            borderColor:  'rgba(221, 221, 221, .5)'}, styles.shadowStyle]}>
            <TouchableOpacity onPress={() => {onPressProfitLoss()}}
                              style={{alignItems: 'center'}}>
                <Animated.View style={{ transform: [{ rotateZ: arrowAngle }] }}>
                    <AntDesign name = {expand ?'caretdown' : 'caretup'} color={'#75147C'} size={16}/>
                </Animated.View>
            </TouchableOpacity>
            {
                expand ?
                    <View style={{flex: 1,width: '100%', justifyContent: 'center', alignItems: 'center',}}>
                        {renderDetailRow("Current Value:", getCurrentValue().toFixed(2))}
                        {renderDetailRow("Total Investment:", getInvestmentValue().toFixed(2))}
                        {renderDetailRow("Today's Profit & Loss:", getTodaysProfitAndLoss().toFixed(2), true)}
                        {renderProfitAndLoss()}
                    </View>
                     :
                    <View{renderProfitAndLoss()}/>
            }
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    shadowStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 5,
    },
    rowCommonStyle : { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 8 },
    boldText:{ fontWeight: 'bold', color: 'black' }
});

export default App;
