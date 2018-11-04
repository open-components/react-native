import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import HeaderTitle from "../../components/header";
import Toast from "../../components/toast";


const data = ['关于士多通宝', '检查版本更新', '意见反馈']
export default class Setting extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  goBack = () => {
    this.props.navigation.goBack();
  }
  //退出登录
  exit = () => {
    HttpUtil.GET('/exit').then(({ desc }) => {
      this.refs.toast.show(desc, 1000);
      CLEAR_All();
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'Tab' }),
          NavigationActions.navigate({ routeName: 'Login', params: { type: 'exit', toast: '退出成功' } }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    })
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, height: HEIGHT, backgroundColor: '#f5f5f5', paddingTop: paddingTop() + SCALE(88) }}>
        <StatusBar
          animated={true}
          hidden={false}  //是否隐藏状态栏。  
          backgroundColor={'#fff'} //状态栏的背景色   
          translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')   
        >
        </StatusBar>
        <Toast ref='toast'></Toast>
        <HeaderTitle
          title={'设置'}
          headerStyle={{ backgroundColor: '#fff' }}
          solid={true}
          titleStyle={{ color: '#333' }}
          _goBack={this.goBack}
        />
        <View style={styles.top}>
          <Image style={styles.topImg} source={require('../../resource/images/logo.png')}></Image>
          <Text style={styles.topText}>版本号：1.0.11</Text>
        </View>

        <View style={styles.center}>
          {data.map((e, i) => <TouchableHighlight key={i} activeOpacity={0.5} underlayColor={'#eee'} onPress={() => { Log(1) }}>
            <View style={[styles.centerLine, !!i ? styles.borderTop : {}]}>
              <Text style={styles.centerText}>{e}</Text>
              <Image source={require('../../resource/images/right_enter_gray.png')} style={styles.sectionRight}></Image>
            </View>
          </TouchableHighlight>)}
        </View>

        <Text style={styles.exit} onPress={this.exit}>退出登录</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderTop: {
    ...layout.border(SCALE(1), '#e6e6e6', 'top')
  },
  top: {
    height: SCALE(320),
    backgroundColor: '#fff',
    paddingTop: SCALE(48),
    alignItems: 'center',
  },
  topImg: {
    width: SCALE(120),
    height: SCALE(120),
    resizeMode: 'contain',
  },
  topText: {
    fontSize: SCALE(28),
    paddingTop: SCALE(15),
    color: '#737373'
  },
  center: {
    backgroundColor: '#fff',
    marginTop: SCALE(20),
    paddingLeft: SCALE(30)
  },
  centerLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: SCALE(88),
    alignItems: 'center'
  },
  centerText: {
    fontSize: SCALE(28),
    color: '#333'
  },
  sectionRight: {
    width: SCALE(28),
    height: SCALE(28),
    resizeMode: 'contain',
    marginRight: SCALE(30)
  },
  exit: {
    marginTop: SCALE(200),
    fontSize: SCALE(32),
    color: '#e74444',
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: SCALE(690),
    height: SCALE(88),
    elevation: 2,
    textAlign: "center",
    textAlignVertical: 'center',
    borderRadius: SCALE(8),
    ...Platform.select({
      ios: {
        lineHeight: SCALE(88),
      },
      android: {}
    }),
  },
})