import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native';
import HeaderTitle from "../../components/header";
import Toast from "../../components/toast";
import { SmartRefreshControl, AnyHeader, StoreHouseHeader, DefaultHeader } from 'react-native-smartrefreshlayout';
// import MJRefresh,{FlatList} from 'react-native-mjrefresh-lower'

export default class MyTeam extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      actionBar: [{
        title: '一级',
        active: true
      }, {
        title: '二级',
        active: false
      },]
    }
  }
  componentDidMount() {
    // HttpUtil.GET('/my/detail').then(({ data }) => {
    // })
  }
  goBack = () => {
    this.props.navigation.goBack();
  }
  //切换级数
  changeActive(i) {
    this.state.actionBar.map((m, k) => {
      if (i == k) {
        m.active = true;
      } else {
        m.active = false;
      }
    });
    this.setState({
      actionBar: this.state.actionBar.concat()
    })
  }
  render() {
    const { navigate } = this.props.navigation;
    const { actionBar } = this.state;
    return (
      <View style={{ flex: 1, height: HEIGHT, backgroundColor: '#fafafa', paddingTop: paddingTop() + SCALE(88) }}>
        <Toast ref='toast'></Toast>
        <HeaderTitle
          title={'我的团队'}
          headerStyle={{ backgroundColor: '#fff', borderBottomWidth: 0 }}
          solid={true}
          titleStyle={{ color: '#333' }}
          _goBack={this.goBack}
        />
        <View style={styles.topBar}>
          {actionBar.map((e, i) =>
            <TouchableOpacity
              key={'team' + i}
              activeOpacity={0.7}
              style={[styles.bars, e.active ? styles.activeBar : {}]}
              onPress={() => this.changeActive(i)}>
              <Text style={[styles.barText, e.active ? styles.activeText : {}]}>{e.title}</Text>
            </TouchableOpacity>)}
        </View>
        <FlatList
          refreshControl={Platform.os=='android'?<SmartRefreshControl
            ref={refreshcontrol => this.refreshControl = refreshcontrol}
            HeaderComponent={<AnyHeader />}
            maxDragRate={0.1}
            overScrollBounce={false}
            overScrollDrag={false}
            primaryColor={'#fafafa'}
          />:null}
          data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }, { key: 'g' }, { key: 'h' }]}
          renderItem={({ item, index }) => <View style={index === 0 ? { paddingTop: SCALE(30) } : {}}>
            <View style={styles.users}>
              <Image style={styles.usersImg} source={require('../../resource/images/logo.png')}></Image>
              <View style={styles.userText}>
                <View style={styles.userText_}>
                  <Text style={styles.name}>站感受</Text>
                  <Text style={styles.share}>TA已分享<Text style={{ color: '#26beff' }}>10</Text>人</Text>
                </View>
                <View style={[styles.userText_, { paddingTop: SCALE(10) }]}>
                  <Text style={styles.date}>2018-5-6</Text>
                  <Text style={styles.phone_}>1925555631</Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.7} style={styles.userPhone}>
                <View style={styles.line}></View>
                <Image style={styles.phone} source={require('../../resource/images/phone.png')}></Image>
              </TouchableOpacity>
            </View>
          </View>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#fff',
    height: SCALE(80),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...layout.border(SCALE(1), '#e5e5e5', 'bottom')
  },
  bars: {
    width: SCALE(120),
    height: SCALE(48),
    ...layout.margin(0, SCALE(20)),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBar: {
    backgroundColor: '#26beff'
  },
  barText: {
    fontSize: SCALE(32),
    color: '#737373'
  },
  activeText: {
    color: '#fff'
  },
  users: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SCALE(176),
    ...layout.padding(SCALE(30), 0, SCALE(30), SCALE(30)),
    ...layout.margin(0, SCALE(30), SCALE(30), SCALE(30)),
    backgroundColor: '#fff',
    borderRadius: SCALE(8),
    ...layout.shadow('#000', { w: 0, h: SCALE(4) }, 0.08, SCALE(20)),
    elevation: 2
  },
  usersImg: {
    flexShrink: 0,
    width: SCALE(108),
    height: SCALE(108),
    borderRadius: 100,
  },
  userText: {
    flex: 1,
    ...layout.padding(0, SCALE(30))
  },
  userText_: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: SCALE(32),
    color: '#333'
  },
  share: {
    fontSize: SCALE(24),
    color: '#999'
  },
  date: {
    fontSize: SCALE(24),
    color: '#999'
  },
  phone_: {
    fontSize: SCALE(24),
    color: '#999'
  },
  userPhone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    backgroundColor: '#e5e5e5',
    width: 1,
    height: SCALE(108)
  },
  phone: {
    flexShrink: 0,
    ...layout.margin(0, SCALE(30)),
    width: SCALE(60),
    height: SCALE(60),
  }
})