import React, { Component } from 'react';
import {
  StatusBar,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  SectionList,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native';
import { SmartRefreshControl, AnyHeader, StoreHouseHeader, DefaultHeader } from 'react-native-smartrefreshlayout';
import NavigationService from '../../../components/NavigationService';
import HeaderTitle from "../../../components/header";
import Toast from "../../../components/toast";

export default class Integral extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {

  }
  goBack = () => {
    this.props.navigation.goBack();
  }
  _clickHelp = () => {
    console.log('需要帮助')
  }
  render() {
    const { navigate } = this.props.navigation;
    const { userInfo } = this.state;
    return (
      <View style={{ flex: 1, height: HEIGHT, backgroundColor: '#fafafa', paddingTop: StatusBar.currentHeight + SCALE(88) }}>
        <Toast ref='toast'></Toast>
        <HeaderTitle
          title={'积分'}
          headerStyle={{ backgroundColor: '#fff' }}
          solid={true}
          titleStyle={{ color: '#333' }}
          _goBack={this.goBack}
          headerRight={{
            title: require('../../../resource/images/help.png'),
            cb: this._clickHelp
          }}
        />
        <ImageBackground source={require('../../../resource/images/mine/integral/background.png')} style={styles.topImg}>
          <Text style={styles.topTitle}>我的积分</Text>
          <Text style={styles.topTitle_}>888</Text>
          <View style={styles.topBars}>
            <Text style={styles.barTitle}>积分明细</Text>
            <Text style={styles.barTitle}>购买积分</Text>
          </View>
        </ImageBackground>
        <View style={styles.mall}>
          <Text style={styles.mallTitle}>积分兑换</Text>
          <FlatList
            refreshControl={<SmartRefreshControl
              ref={refreshcontrol => this.refreshControl = refreshcontrol}
              HeaderComponent={<AnyHeader />}
              maxDragRate={0.1}
              overScrollBounce={false}
              overScrollDrag={false}
              primaryColor={'#fafafa'}
            />}
            ListFooterComponent={<Text style={styles.bottom}>已经到底了</Text>}
            style={{ height: HEIGHT - SCALE(500) }}
            horizontal={false}
            numColumns={2}
            data={[{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }, { key: 'g' }, { key: 'h' }]}
            renderItem={({ item, index }) =>
              <TouchableOpacity activeOpacity={0.7} style={styles.items}>
                <Image style={styles.itemImg} source={require('../../../resource/images/tabs/mall.png')}></Image>
                <View style={styles.goodsInfo}>
                  <Text style={styles.goodsTitle}>岁月静好 兰蔻眼霜</Text>
                  <Text style={styles.goodsPrice}>160积分</Text>
                </View>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topImg: {
    width: WIDTH,
    height: SCALE(290),
    alignItems: 'center'
  },
  topTitle: {
    paddingTop: SCALE(70),
    color: '#fff',
    fontSize: SCALE(24)
  },
  topTitle_: {
    color: '#fff',
    fontSize: SCALE(40),
    fontWeight: 'bold',
  },
  mall: {
    paddingLeft: SCALE(10)
  },
  topBars: {
    width: WIDTH + SCALE(280),
    ...layout.padding(SCALE(10), SCALE(70)),
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  barTitle: {
    ...layout.border(SCALE(1), '#fff', ''),
    ...layout.padding(SCALE(5), 0),
    color: '#fff',
    fontSize: SCALE(24),
    width: SCALE(128),
    textAlign: 'center',
    borderRadius: 100
  },
  mallTitle: {
    ...layout.padding(0, SCALE(10), 0, SCALE(30)),
    color: '#333',
    fontSize: SCALE(28),
    fontWeight: 'bold',
    marginBottom: SCALE(30),
  },
  columnWrapperStyle: {
    width: (WIDTH - SCALE(80)) / 2,
    flexWrap: 'wrap'
  },
  items: {
    width: (WIDTH - SCALE(80)) / 2,
    height: SCALE(440),
    marginTop: SCALE(2),
    marginLeft: SCALE(20),
    marginBottom: SCALE(28),
    borderRadius: SCALE(8),
    backgroundColor: '#fff',
    alignItems: 'center',
    ...layout.shadow('#000', { w: 0, h: SCALE(4) }, 0.04, SCALE(20)),
    elevation: 4
  },
  itemImg: {
    width: (WIDTH - SCALE(80)) / 2,
    height: SCALE(335)
  },
  goodsInfo: {
    height: SCALE(105),
    alignItems: 'center',
    justifyContent: 'center'
  },
  goodsPrice: {
    fontSize: SCALE(24),
    color: '#26beff',
  },
  goodsTitle: {
    fontSize: SCALE(28),
    color: '#333',
  },
  bottom: {
    color: '#999',
    fontSize: SCALE(24),
    textAlign: 'center'
  },
})