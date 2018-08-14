import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Florida from './Florida';
import CurrentPlace from './CurrentPlace';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Florida />
        <CurrentPlace />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
