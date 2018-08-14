import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
// import { Constants, MapView, Location, Permissions } from 'expo'
import { toDateTime } from "./util";

const URI = 'ws://ws.weatherflow.com/swd/data?api_key=20c70eae-e62f-4d3b-b3a4-8586e90f3ac8'

class Florida extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connection: false,
            temperature: '',
            humidity: '',
            date: ''
        };
    }

    async componentDidMount() {
        const storedVal = await AsyncStorage.getItem('weatherValue');
        storedVal && this.setState({ ...JSON.parse(storedVal) })

        const data = {
            "type": "listen_start",
            "device_id": 1110,
            "id": "random-id-12345"
        }
        var ws = new WebSocket(URI);

        ws.onopen = () => {
            this.setState({ connection: true });
            // connection opened
            ws.send(JSON.stringify(data)); // send a message
        };

        ws.onmessage = async (e) => {
            // a message was received
            let data = JSON.parse(e.data.toString()).obs
            if (!data) return

            data = data[0]
            const [temperature, humidity, date] = [data[2], data[3], data[0]]

            this.setState({
                temperature,
                humidity,
                date
            });
            try {
                await AsyncStorage.setItem('weatherValue', JSON.stringify({ temperature, humidity, date }));
            } catch (error) {
                console.log('error', error);
            }
        };

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
        };
    }

    render() {
        let { connection, temperature, humidity, date } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text>Weather In Florida</Text>
                </View>
                {
                    temperature &&
                    <View>
                        <View style={styles.item}>
                            <Text>{connection ? 'Connected' : 'Disconnected'}</Text>
                        </View>
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

export default Florida;