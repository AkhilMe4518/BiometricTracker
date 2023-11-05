
import { Fragment, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

export default function IndicatorImage(props) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Fragment>
            {isLoading && <ActivityIndicator size={24}/>}
        <View style={styles.imageContainer}>
            {!props.Morning &&
                !props.Evening &&
                <Image source={require("../assets/images/biometricZ.png")}
                style={[styles.image, styles.unMarked]}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={()=>setIsLoading(false)}
                />}
            {props.Morning &&
                !props.Evening &&
                <Image source={require("../assets/images/LoadingZ.png")}
                style={[styles.image, styles.loadingImage]}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={()=>setIsLoading(false)}
                />}
            {props.Morning &&
                props.Evening &&
                <Image source={require("../assets/images/biometricZ.png")}
                style={[styles.image, styles.marked]}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={()=>setIsLoading(false)}
                />}

                </View>
            </Fragment>
    )
} 

const styles = StyleSheet.create({
    unMarked: {
        opacity: 0.6,
    },
    marked: {
        opacity:1,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imageContainer: {
        alignContent: "center",
        justifyContent:"center",
        height: 200,
        width: 200,
        overflow:"hidden"
    }
})