import React, { Component } from 'react';
import {
  View,
  Easing,
  ImageBackground,
  Text,
  StyleSheet,
  Animated,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import NavigationService from '../../components/NavigationService';
import { SmartRefreshControl, ClassicsHeader, StoreHouseHeader, DefaultHeader } from 'react-native-smartrefreshlayout';

const orders = [{
  src: require('../../resource/images/mine/order/no_pay.png'),
  type: '未付款'
}, {
  src: require('../../resource/images/mine/order/no_send.png'),
  type: '待发货'
}, {
  src: require('../../resource/images/mine/order/no_delivery.png'),
  type: '待收货'
}, {
  src: require('../../resource/images/mine/order/no_appraise.png'),
  type: '未评价'
}, {
  src: require('../../resource/images/mine/order/complete.png'),
  type: '已完成'
}]

const bottomBars = [{
  src: require('../../resource/images/mine/mine_team.png'),
  type: '我的团队',
  router: 'MyTeam'
}, {
  src: require('../../resource/images/mine/QR_code.png'),
  type: '我的二维码'
}, {
  src: require('../../resource/images/mine/scan.png'),
  type: '扫一扫',
  router: 'Scan'
}, {
  src: require('../../resource/images/mine/mine_share.png'),
  type: '我的分享'
}, {
  src: require('../../resource/images/mine/apply_shop.png'),
  type: '申请店铺'
}]

export default class Mine extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      translateY: new Animated.Value(0),
      username: '',
      header: '',
      remain: 0,
      share_phone: '',
      share_username: '',
      integral: 0,
      msgs: []
    };
    this.loopIndex = 1;//滚动index
  }
  //测试注释-------------------------------------------------------------------
  // static navigationOptions = ({ navigation, screenProps }) => ({
  //   tabBarOnPress: (({ defaultHandler }) => {
  //     READ_CACHE('token', (res) => {
  //       defaultHandler();
  //     }, () => {
  //       NavigationService.navigate('Login', { toast: '登陆过期，请重新登录' });
  //     })
  //   })
  // });
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      // this._getInfo();//获取初始数据
    });
  }
  componentWillUnmount() {
    this._navListener.remove();
  }
  //获取数据
  _getInfo = () => {
    HttpUtil.GET('/my/home').then(({ data }) => {
      const { username, header, integral, remain } = data;
      this.setState({
        username,
        header,
        integral,
        remain,
      })
    });
    HttpUtil.GET('/my/detail').then(({ data }) => {
      const { share_phone, share_username } = data;
      this.setState({
        share_phone,
        share_username,
      })
    });
    HttpUtil.GET('/my/message').then(({ data }) => {
      this.setState({
        msgs: data.concat()
      }, () => {
        if (this.state.msgs.length > 2) {
          this.loopMsg();
        }
      })
    });
  }
  //切换路由
  change_router(routeName) {
    NavigationService.navigate(routeName);
  }
  //消息滚动
  loopMsg() {
    Animated.timing(this.state.translateY, {
      toValue: -SCALE(40 * this.loopIndex),
      delay: 2000,
      duration: 1000,
      easing: Easing.linear
    }).start(() => {
      if (this.loopIndex < this.state.msgs.length) {
        this.state.translateY.setValue(-SCALE(40 * this.loopIndex));
        this.loopIndex++;
      } else {
        this.state.translateY.setValue(0);
        this.loopIndex = 1;
      }
      this.loopMsg();
    })
  }
  render() {
    const { username, header, remain, integral, share_phone, share_username, msgs } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.topBar}>
            <Text style={styles.topBarText}>我的</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.change_router('Setting')}>
              <Image style={styles.topBarImg} source={require('../../resource/images/mine/setting.png')}></Image>
            </TouchableOpacity>
          </View>

          <View style={styles.user}>
            <Image style={styles.userImg} source={{ uri: header }}></Image>
            <TouchableOpacity style={styles.userInfo} activeOpacity={0.7} onPress={() => this.change_router('UserInfo')}>
              <Text style={styles.userName}>{username}</Text>
              <Text style={styles.shareInfo}>{share_username}：{share_phone}</Text>
            </TouchableOpacity>
            <Image style={styles.right} source={require('../../resource/images/right_enter_gray.png')}></Image>
          </View>

          <ImageBackground style={styles.integral} source={require('../../resource/images/mine/mine_back.png')}>
            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={() => this.change_router('UserInfo')}
              style={styles.integralItem}>
              <Text style={styles.integralText}>余额</Text>
              <Text style={styles.integralText_}>{remain}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.integralItem}
              onPress={() => this.change_router('Integral')}>
              <Text style={styles.integralText}>积分</Text>
              <Text style={styles.integralText_}>{integral}</Text>
            </TouchableOpacity>
          </ImageBackground>

          <TouchableOpacity activeOpacity={0.7} style={styles.msgs}>
            <Image style={styles.msgImg} source={require('../../resource/images/mine/msg.png')}></Image>
            <Animated.View
              style={{
                paddingLeft: SCALE(10),
                alignSelf: 'flex-start',
                transform: [{
                  translateY: this.state.translateY
                }]
              }}
            >
              {msgs.map((e, i) =>
                <View key={'masgs' + i} style={styles.msgItem}>
                  <View style={styles.msgIcon}><Text style={styles.iconText}>{e.title}</Text></View>
                  <Text style={styles.msgText}>{e.content.length > 15 ? e.content.slice(0, 15) + '...' : e.content}</Text>
                </View>)}
              {msgs.length % 2 == 1 && <View style={styles.msgItem}>
                <View style={styles.msgIcon}><Text style={styles.iconText}></Text></View>
                <Text style={styles.msgText}></Text>
              </View>}
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.order}>
            <Text style={styles.orderTitle}>我的订单</Text>
            <View style={styles.orderStatus}>
              {orders.map((e, i) =>
                <TouchableOpacity key={'order' + i} style={styles.orderItem} activeOpacity={0.7}>
                  <Image style={styles.orderImg} source={e.src}></Image>
                  <Text style={styles.orderText}>{e.type}</Text>
                </TouchableOpacity>)}
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          {bottomBars.map((e, i) =>
            <TouchableOpacity key={'barsss' + i} style={styles.btmItem} activeOpacity={0.7} onPress={() => this.change_router(e.router)}>
              <Image style={styles.btmImg} source={e.src}></Image>
              <Text style={styles.btmText}>{e.type}</Text>
            </TouchableOpacity>)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#fafafa',
    paddingTop: paddingTop(),
  },
  top: {
    backgroundColor: '#fff',
    ...layout.padding(0, SCALE(30))
  },
  topBar: {
    flexDirection: 'row',
    height: SCALE(88),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarText: {
    fontSize: SCALE(40),
    color: '#333',
    fontWeight: 'bold'
  },
  topBarImg: {
    width: SCALE(40),
    height: SCALE(40),
  },
  user: {
    flexDirection: 'row',
    ...layout.padding(SCALE(20), 0, SCALE(20), 0)
  },
  userImg: {
    width: SCALE(128),
    height: SCALE(128),
    borderRadius: 100,
    flexShrink: 0,
  },
  right: {
    width: SCALE(35),
    height: SCALE(35),
    resizeMode: 'contain',
    alignSelf: 'center',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'space-around',
    ...layout.padding(SCALE(8), 0, SCALE(8), SCALE(30))
  },
  userName: {
    fontSize: SCALE(36),
    color: '#333'
  },
  shareInfo: {
    fontSize: SCALE(26),
    color: '#737373'
  },
  integral: {
    flexDirection: 'row',
    width: WIDTH - SCALE(30),
    alignSelf: 'center',
    justifyContent: 'center',
    height: SCALE(160),
    ...layout.padding(SCALE(40), SCALE(30)),
    marginBottom: SCALE(30)
  },
  integralItem: {
    flex: 1,
    alignItems: 'center'
  },
  integralText: {
    fontSize: SCALE(28),
    color: '#fff',
  },
  integralText_: {
    fontSize: SCALE(40),
    color: '#fff',
    fontWeight: 'bold'
  },
  msgs: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 100,
    height: SCALE(88),
    ...layout.padding(SCALE(4), SCALE(24)),
  },
  msgImg: {
    width: SCALE(60),
    height: SCALE(60),
  },
  msgItem: {
    height: SCALE(40),
    alignItems: 'center',
    flexDirection: 'row'
  },
  msgIcon: {
    height: SCALE(28),
    ...layout.border(SCALE(1), '#ffbe26', ''),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SCALE(4)
  },
  iconText: {
    fontSize: SCALE(22),
    color: '#ffbe26',
  },
  msgText: {
    fontSize: SCALE(26),
    paddingLeft: SCALE(10),
    color: '#737373'
  },
  order: {
    paddingTop: SCALE(40)
  },
  orderTitle: {
    fontSize: SCALE(28),
    color: '#333',
    fontWeight: 'bold'
  },
  orderStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: SCALE(170),
    ...layout.padding(SCALE(32), 0)
  },
  orderItem: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  orderImg: {
    width: SCALE(60),
    height: SCALE(60),
  },
  orderText: {
    fontSize: SCALE(28),
    color: '#737373'
  },
  bottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 0,
    height: SCALE(344),
    marginTop: SCALE(20),
    backgroundColor: '#fff'
  },
  btmItem: {
    height: SCALE(150),
    width: WIDTH / 3,
    alignItems: 'center',
    paddingTop: SCALE(20)
  },
  btmImg: {
    width: SCALE(80),
    height: SCALE(80),
  },
  btmText: {
    fontSize: SCALE(28),
    color: '#737373'
  },
})