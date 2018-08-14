import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { toDateTime } from "./util";

class CurrentPlace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            temperature: '',
            humidity: '',
            date: ''
        };
    }

    async getCurrentWather(URI) {
        try {
            let data = await fetch(URI)
            const { dt, main } = await data.json()
            const { temp, humidity } = main

            this.setState({
                temperature: temp,
                humidity,
                date: dt
            });
            console.log('dt', dt);

            await AsyncStorage.setItem('weatherCurrent', JSON.stringify({ temperature: temp, humidity, date: dt }));

        } catch (error) {
            console.error(error);
        }
    }

    async getLocationAsync() {
        const { Location, Permissions } = Expo;
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            return Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        } else {
            throw new Error('Location permission not granted');
        }
    }

    async componentDidMount() {
        const storedVal = await AsyncStorage.getItem('weatherValue');
        storedVal && this.setState({ ...JSON.parse(storedVal) })

        const location = await this.getLocationAsync()
        const { latitude, longitude } = location.coords
        const URI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=6db1ed68cf50f022649445d3ad462937`
        this.getCurrentWather(URI)
    }

    render() {
        let { temperature, humidity, date } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text>The weather at your place</Text>
                </View>
                {
                    temperature &&
                    <View>
                        <View style={styles.item}>
                            <Text>{`Temperature ${temperature} C`}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text>{`Humidity ${humidity} %`}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text>{`Last update ${toDateTime(date)}`}</Text>
                        </View>
                    </View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        marginTop: 30
    },
    item: {
        marginTop: 30
    },
});

export default CurrentPlace;