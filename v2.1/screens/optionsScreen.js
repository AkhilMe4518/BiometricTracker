
import {StyleSheet, View ,Button,Text, Alert, ScrollView} from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { useEffect, useState } from 'react';
import FIREBASE_API from "../secrets/secrets";
import { useNavigation } from "@react-navigation/native";
// import Holidays from "date-holidays";

// console.log(new Holidays().getStates('us'));

// const hd = new Holidays();
// const h = hd.getHolidays();
// console.log(h);
// console.log(hd.isHoliday(new Date('2016-02-09 00:00:00 GMT+0000')));

// import { showMessage, hideMessage } from "react-native-flash-message";
// import { useIsFocused } from "@react-navigation/native";

export default function OptionsScreen({ route }) {

    const navigation = useNavigation();
    // const isFocused = useIsFocused();
    // const [holidays, setHolidays] = useState([]);

    const [date, setDate] = useState("")
    
    const MData = route.params.MorningsData;
    const EData = route.params.EveningsData;
    const [customDatesStyles,setCustomDatesStyles] = useState([]);
    
    function setDateStyles(timeStamp) {
        const s = []
        let today = (timeStamp=="Default") ? moment(): moment(timeStamp);
        let day = today.clone().startOf('month');
        const lastDayOfMonth = day.clone().endOf('month');
        while (day.isSameOrBefore(lastDayOfMonth, 'day')) {
            const curDate = day.format('ddd MMM DD YYYY');
            const morningMarked = MData.includes(curDate); 
            const eveningMarked = EData.includes(curDate);
            // console.log(moment(day).isHoliday());
            // console.log(day.toISOString());

            const color = { color: ((curDate.includes("Sun")))?"#BAD7E9":"#FF6464" };
            // console.log(curDate, curDate.includes("Sun"));
            if (morningMarked && eveningMarked ){
                color.color = "#29BB89";
            }
            else if ((morningMarked || eveningMarked)) {
                color.color = "#F7EA00";
            }
    
            s.push({
                date: day.clone(),
                style: {backgroundColor:color.color},
                textStyle: {color: 'black'},
                containerStyle: [], 
                allowDisabled: true,
            }
            );
            day.add(1, 'day');
        }
        setCustomDatesStyles(s);
    }

    useEffect(() => {
        return (
            setDateStyles("Default")
        );
    }, [])

    // useEffect(() => {
    //     navigation.goBack()
    // },[isFocused])

    async function updateDatabase(newMdata, newEdata) {
        const M = [...newMdata];
        const E = [...newEdata];
        if (M.length===0) {
            M.push("12 12")
        } 
        if (E.length===0) {
            E.push("12 12")
        } 
        
        const response = await fetch(FIREBASE_API + "MorningMarked.json/",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(M)
            }
        )
        const response1 = await fetch(FIREBASE_API + "EveningMarked.json/",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(E)
            }
        )
        navigation.goBack();
    }

    function deletePickedDateData() {
        Alert.alert('Do you want to clear', `${date} Permenently.`, [
            {
                text: 'Cancel',
                style: "destructive",
            },
            {
                text: 'Yes',
                style: "default",
                onPress: () => {
                    const newMdata = MData.filter((item) => item !== date);
                    const newEdata = EData.filter((item) => item !== date);
                    // console.log(newMdata);
                    // console.log(newEdata); 
                    updateDatabase(newMdata, newEdata);
                }
            },
        ]);
    }
    function clearDatabase() {
        Alert.alert('Clear Database ?', `This clears all existing data.`, [
            {
                text: 'Cancel',
                style: "destructive",
            },
            {
                text: 'Yes',
                style: "default",
                onPress: () => {
                    updateDatabase([],[]);
                }
            },
        ]);
    }

    function travelPast() {
        navigation.navigate("Past Home", {
            date: date,
        })
    }

    function handleDateChange(selectedDate) {
        if (selectedDate.isAfter(moment())) {
            setDate("");
            return
        }
        setDate(selectedDate.format('ddd MMM DD YYYY'))
    }


    return (
        <View style={styles.container}>
            {/* <ScrollView style={{flex:1}}> */}
            <View style={styles.container}>

                <CalendarPicker
                    // scrollable={true}
                        todayTextStyle={{ fontWeight: 'bold' }}
                        todayBackgroundColor={'transparent'}
                        customDatesStyles={customDatesStyles}
                        onMonthChange={(data) => setDateStyles(data)}
                        dayShape='circle'
                        selectedDayColor='#352F44'
                    selectedDayTextColor='white'
                    onDateChange={handleDateChange}
                />
            </View>

            <View style={[styles.container,{flex:0.8}]}>
                <View>
                    <Button disabled={date === ""} title={date===""?"Pick and Clear":`Clear ${date}`} onPress={deletePickedDateData}/>
                    <Button title="Clear Data" onPress={clearDatabase}/>
                </View>
                <View>
                <Button disabled={date === ""} title={date===""?"Pick and TravelPast":`Travel to ${date}`} onPress={travelPast}/>
            </View>
                </View>
                {/* </ScrollView> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})