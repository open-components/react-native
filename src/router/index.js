import React, { PureComponent } from 'react';
import { Image,BackHandler,View,StatusBar,ToastAndroid } from 'react-native';
import {createBottomTabNavigator } from 'react-navigation'

import home from './home'
import mall from './mall'
import mine from './mine'


const Tabs = createBottomTabNavigator ({
    //每一个页面的配置
    Home: {
        screen: home,//当前选项卡加载的页面
        path:'router/home',
        //配置每一个选项卡的样式
        navigationOptions: {
            tabBarLabel: '资产',//显示的标签文字
            //显示的图片
            tabBarIcon: ({tintColor,focused}) => (
                <Image
                    source={focused ? require('../resource/images/tabs/property_fill.png') : require('../resource/images/tabs/property.png')}
                    style={[{height: SCALE(50), width: SCALE(50)}, {tintColor: tintColor}]}
                />
            ), 
        },
    }, 
    Mall: {
        screen: mall,
        path:'router/mall',
        navigationOptions: {
            tabBarLabel: '商城',
            tabBarIcon: ({tintColor,focused}) => (
                <Image
                    source={focused ? require('../resource/images/tabs/mall_fill.png') : require('../resource/images/tabs/mall.png')}
                    style={[{height: SCALE(50), width: SCALE(50)}, {tintColor: tintColor}]}/>
            ),
        }
    },
    Mine: {
        screen: mine,
        path:'router/mine',
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor,focused}) => (
                <Image
                    source={focused ? require('../resource/images/tabs/mine_fill.png') : require('../resource/images/tabs/mine.png')}
                    style={[{height: SCALE(50), width: SCALE(50)}, {tintColor: tintColor}]}/>
            ),
        }
    },

}, {
    //是否在更改标签时显示动画
    animationEnabled: true,
    //是否允许在标签之间进行滑动
    swipeEnabled: false,
    //按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    backBehavior: "none",
    //设置Tab标签的属性
    tabBarOptions: {
        //Android属性
        upperCaseLabel: false,//是否使标签大写，默认为true
        //共有属性
        showIcon: true,//是否显示图标，默认关闭
        showLabel: true,//是否显示label，默认开启
        style: { //TabNavigator 的背景颜色
            backgroundColor: 'white',
            height: SCALE(100),
        },
        indicatorStyle: {//标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
            height: 0,
        },
        labelStyle: {//文字的样式
            fontSize: SCALE(26),
            marginTop: SCALE(10)*-1,
            marginBottom: SCALE(10),
        },
        iconStyle: {//图标的样式
            marginBottom: SCALE(10),
        }
    },
});

export default class Tab extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackPressed)
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPressed)
    );
  }

  onBackPressed = () => {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        BackHandler.exitApp();
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT) 
    return true;
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPressed);
  }

  render() {
    return(
        <View style={{width:WIDTH,height:HEIGHT}}>
          <StatusBar
            hidden={false}  //是否隐藏状态栏。  
            backgroundColor={'#fff'} //状态栏的背景色   
            translucent={true} //指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
            barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')   
          ></StatusBar>  
          <Tabs/>
        </View>
    ) 
  }
}
Tab.navigationOptions = {
    header:null
}