
import {
    Text, View, StyleSheet, SafeAreaView, Button, Alert, TouchableOpacity
} from 'react-native';

import FIREBASE_API from '../secrets/secrets';
import { useEffect, useState } from 'react';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import IndicatorImage from '../components/image';


export default function PastScreen({ route }) {
    const [changes, setChanges] = useState({
        M: false,
        E:false
    });
    const pastDate = route.params.date;
    // console.log(route.params.date);
    const navigation = useNavigation();

    const isFocused = useIsFocused(false);

    const [mornings, setMornings] = useState([]);
    const [evenings, setEvenings] = useState([]);

    const [status, setStatus] = useState({
        Morning: false,
        Evening: false
    })

    useEffect(() => {
        setStatus(prevValue => { return {
            ...prevValue,
            Morning: mornings.includes(pastDate),
            Evening: evenings.includes(pastDate),
        }})
    }, [evenings, mornings])
    

    useEffect(() => {
        async function fetchFirebaseInstance(actionType) {
            const response = await fetch(FIREBASE_API+`${actionType}Marked.json/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await response.json();
            const M = [];
            const E = [];
            (Object.keys(data)).forEach(element => {
                if (actionType === "Morning") {
                    M.push(data[element])
                }
                else {
                    E.push(data[element])
                }
            });
            if (actionType === "Morning") {
                setMornings(M);
             }
            else {
                setEvenings(E);
            }

        }
        fetchFirebaseInstance("Morning");
        fetchFirebaseInstance("Evening");
    },[isFocused])

    function handleMorning() {
        Alert.alert('Do you like to mark', 'Morning Attendence', [
            {
                text: 'Cancel',
                style: "destructive",
            },
            {
                text: 'Yes',
                style: "default",
                onPress: () => {
                    setStatus(prevValue => {
                        return {
                            ...prevValue,
                            Morning: true,
                            Evening:false,
                        }
                    }
                    )
                    setChanges(prevValue => {
                        return {
                            ...prevValue,
                            M:true
                        }
                    })
                }
            },
        ]);
    }

    function handleEvening() {
        if (!status.Morning) {
            Alert.alert('Please Mark Morning Attendence!!', 'Before Marking Evening', [
                {
                    text: 'Ok',
                    style: "default",
                    onPress: () => {
                    }
                },
            ]);
            return;
        }
        Alert.alert('Do you like to mark', 'Evening Attendence', [
            {
                text: 'Cancel',
                style: "destructive",
            },
            {
                text: 'Yes',
                style: "default",
                onPress: () => {
                    setStatus(prevValue => {
                        return {
                            ...prevValue,
                            Evening:true,
                        }
                    })
                    setChanges(prevValue => {
                        return {
                            ...prevValue,
                            E:true
                        }
                    })
                }
            },
        ]);
    }

    async function updateDatabase(type) {
        const body = pastDate;
        if (type === "Morning") {
            setMornings(prevValue=>[body,...prevValue])
        }
        else {
            setEvenings(prevValue=>[body,...prevValue])
        }
        const response = await fetch(FIREBASE_API +`${type}Marked.json/`,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            })
    }

    function makeChanges() {
        if (changes.M) {
            updateDatabase("Morning");
        }
        if (changes.E) {
            updateDatabase("Evening");
        }
        navigation.navigate('Home')
    }
    
    return (
        <View style={styles.container}>
        <SafeAreaView>
                <View style={styles.view}>
                    
                    <IndicatorImage
                        renderPurpose={isFocused}
                        Morning={status.Morning}
                        Evening={status.Evening}
                />

                    <View style={styles.view}>

                <View style={{flexDirection:"row",margin:20}}>
                    <Button title='Morning' disabled={status.Morning} onPress={handleMorning}/>
                    <Button title='Evening' disabled={status.Evening} onPress={handleEvening}/>
                        </View>
                    </View>
                    <View>
                    {!status.Morning || !status.Evening ? 
                    <Text>
                        Biometric For {pastDate} is yet to be marked !!
                        </Text> :
                        <Text>
                            Biometric Marked !!!
                                </Text>}
                    </View>
                    <View>
                        <Button title='Make Changes' onPress={makeChanges}></Button>
                    </View>
            </View>
            </SafeAreaView>
            </View>
    )
} 

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})