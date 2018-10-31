import React, { Component } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import NavigationService from '../../components/NavigationService';

export default class Mall extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      turnOn: false
    }
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      // StatusBar.setBarStyle('light-content');
    });
  }
  componentWillUnmount() {
    this._navListener.remove();
  }
  //切换路由
  change_router(routeName) {
    NavigationService.navigate(routeName);
  }
  render() {
    return (
      <View style={{ flex: 1, height: HEIGHT, backgroundColor: '#fafafa', paddingTop: StatusBar.currentHeight }}>
        <View style={styles.topText}>
          <Text style={styles.topText_}>商城</Text>
        </View>
        <View style={styles.center}>
          <Image source={require('../../resource/images/development.gif')} style={styles.gif}></Image>
          <Text>该功能暂未开放，敬请等待</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topText: {
    justifyContent: 'center',
    height: SCALE(80),
  },
  topText_: {
    fontSize: SCALE(40),
    paddingLeft: SCALE(30),
    fontWeight: 'bold',
    color: '#333'
  },
  center: {
    flex: 1,
    paddingBottom: SCALE(280),
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: SCALE(200),
    height: SCALE(200),
  },
})