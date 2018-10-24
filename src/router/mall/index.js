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
import { SmartRefreshControl, ClassicsHeader, StoreHouseHeader, DefaultHeader } from 'react-native-smartrefreshlayout';

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
      <View>
        <Text>主页</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create()