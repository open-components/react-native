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
import Toast from "../../components/toast";
import {SmartRefreshControl,ClassicsHeader,StoreHouseHeader,DefaultHeader} from 'react-native-smartrefreshlayout';

export default class Home extends Component {
    //构造函数
    constructor(props) {
      super(props);
      this.state={
          turnOn:false
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
    change_router(routeName){
      NavigationService.navigate(routeName);
    }
    render() {
      return (
        <View>
          {/* <Image source={{uri:'../../resource/images/development.gif'}}></Image> */}
        </View>
      );
    }
}

const styles = StyleSheet.create()