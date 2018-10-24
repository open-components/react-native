import React from 'react';
import { StatusBar } from "react-native";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import StackViewStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';

import NavigationService from './components/NavigationService';

import './utils'
import Tab from './router'
import Login from './components/login'
import Register from './components/register'
import Scan from './components/scanScreen'
import SplashScreen from 'react-native-splash-screen'
import Setting from "./router/mine/setting";
//用户信息
import UserInfo from "./router/mine/userInfo";
import BankCard from "./router/mine/userInfo/bankCard";
import AddBankCard from "./router/mine/userInfo/addBankCard";
import MyTeam from "./router/mine/myTeam";
//积分
import Integral from "./router/mine/integral";


const AppStack = createStackNavigator({
  Tab,     //tab 
  Home: { screen: Tab, path: 'router/home' },
  Mall: { screen: Tab, path: 'router/mall' },
  Mine: { screen: Tab, path: 'router/mine' },
  Register,     //注册 
  Login,   //登录 
  Scan,    //扫码
  Setting, //设置
  UserInfo, //用户信息
  AddBankCard, //添加银行卡
  BankCard, //银行卡管理
  MyTeam, //我的团队
  Integral, //积分
}, {
    headerMode: 'screen',
    mode: 'card',
    initialRouteName: 'Tab',
    transitionConfig: () => ({
      screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    }),
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  });

export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (
      <AppStack
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      >
        <StatusBar
          animated={true}
          hidden={false}  //是否隐藏状态栏。  
          backgroundColor={'#fff'} //状态栏的背景色   
          translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')   
        >
        </StatusBar>
      </AppStack>
    );
  }
}


