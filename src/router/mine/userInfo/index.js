import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  SectionList,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import NavigationService from '../../../components/NavigationService';
import HeaderTitle from "../../../components/header";
import Toast from "../../../components/toast";

export default class UserInfo extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      userInfo: [{
        header: '',
        info: [{
          title: 'ID',
          info: '加载中..'
        }, {
          title: '用户名',
          info: '加载中..'
        }, {
          title: '地址',
          info: '加载中..'
        },]
      }, {
        info: [{
          title: '手机号',
          info: '加载中..'
        }, {
          title: '支付密码',
          info: '修改'
        }, {
          title: '实名认证',
          info: '加载中..',
          router: 'AddBankCard'//测试进入添加银行卡页面，记得改回来-----
        },]
      }, {
        info: [{
          title: '银行卡与支付宝',
          info: '管理银行卡',
          router: 'BankCard'
        }]
      }]
    }
  }
  componentDidMount() {
    // HttpUtil.GET('/my/detail').then(({ data }) => {
    //   this.state.userInfo[0].header = data.header;
    //   this.state.userInfo[0].info[0].info = data.uid;
    //   this.state.userInfo[0].info[1].info = data.username;
    //   this.state.userInfo[0].info[2].info = data.username;
    //   this.state.userInfo[1].info[0].info = data.phone;
    //   this.state.userInfo[1].info[2].info = data.phone;
    //   this.setState({
    //     userInfo: this.state.userInfo.concat()
    //   })
    // })
  }
  goBack = () => {
    this.props.navigation.goBack();
  }
  //上传头像
  updateHeader() {
    const options = {
      title: "选择图片",
      noData: true,
      quality: 0.5,//图片质量0.5
      cancelButtonTitle: "取消",
      takePhotoButtonTitle: "从相机选择",
      chooseFromLibraryButtonTitle: "从相册选择",
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        if (response.fileSize / 1024 / 1024 > 1) {
          this.refs.toast.show('图片不能大于1M', 2500);
          return;
        }
        console.log(response);
        HttpUtil.upload('/upload/image?uploadtype=header', response.fileName, response.type, response.path).then((res) => {
          HttpUtil.POST('/my/header', { header: res.url }).then(res_ => {
            this.state.userInfo[0].header = res.data.thumb;
            this.setState({
              userInfo: this.state.userInfo.concat()
            })
          })
        })
      }
    });
  }
  //修改用户信息
  updateUserInfo({ router }) {
    // StatusBar.setBarStyle('light-content');
    // StatusBar.setBackgroundColor('rgba(50,50,50,0.6)');
    // this.setState({
    //   modalVisible: true
    // })

    //银行卡管理BankCard
    router && this.props.navigation.navigate(router);
  }
  render() {
    const { navigate } = this.props.navigation;
    const { userInfo } = this.state;
    return (
      <View style={{ flex: 1, height: HEIGHT, backgroundColor: '#fafafa', paddingTop: paddingTop() + SCALE(88) }}>
        <StatusBar
          animated={true}
          hidden={false}  //是否隐藏状态栏。  
          backgroundColor={'#fff'} //状态栏的背景色   
          translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
          barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')   
        >
        </StatusBar>
        <Toast ref='toast'></Toast>
        <Modal
          animationType={'none'}
          transparent={true}
          onRequestClose={() => { StatusBar.setBarStyle('dark-content'); StatusBar.setBackgroundColor('#fff');; this.setState({ modalVisible: false }) }}
          visible={this.state.modalVisible}
        >
          <TouchableOpacity onPress={() => { StatusBar.setBarStyle('dark-content'); StatusBar.setBackgroundColor('#fff');; this.setState({ modalVisible: false }) }}>
            <View style={{ width: WIDTH, height: HEIGHT, backgroundColor: 'rgba(50,50,50,0.6)' }}>
              <View style={styles.borderBottom}>
                <TextInput
                  style={styles.input}
                  onChangeText={(value) => this.onPhoneChange(value, i)}
                  textAlignVertical={'center'}
                  placeholderTextColor={'#ccc'}
                  selectTextOnFocus={true}
                  underlineColorAndroid={'transparent'}
                  selectionColor={'#33ddff'}>
                </TextInput>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <HeaderTitle
          title={'用户信息'}
          headerStyle={{ backgroundColor: '#fff' }}
          solid={true}
          titleStyle={{ color: '#333' }}
          _goBack={this.goBack}
        />
        {userInfo.map((e, i) =>
          <View key={'info' + i} style={styles.info}>
            {i == 0 && <TouchableOpacity activeopacity={0.7} style={[styles.infoItem, { height: SCALE(176) }]} onPress={() => this.updateHeader()}>
              <Image style={styles.infoHeader} source={{ uri: e.header }}></Image>
              <Text style={styles.infoText_}>设置头像</Text>
              <Image style={styles.infoImg} source={require('../../../resource/images/right_enter_gray.png')}></Image>
            </TouchableOpacity>}
            {e.info.map((k, n) =>
              <TouchableOpacity key={'infos' + n} style={styles.infoItem} activeopacity={0.7} onPress={() => this.updateUserInfo(k)}>
                <Text style={styles.infoText}>{k.title}</Text>
                <Text style={styles.infoText_}>{k.info}</Text>
                <Image style={styles.infoImg} source={require('../../../resource/images/right_enter_gray.png')}></Image>
              </TouchableOpacity>)}
          </View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    ...layout.margin(SCALE(30), SCALE(30), 0, SCALE(30)),
    backgroundColor: '#fff',
    borderRadius: SCALE(16),
    elevation: 2
  },
  infoItem: {
    ...layout.border(SCALE(1), '#f5f5f5', 'top'),
    ...layout.margin(0, SCALE(30)),
    height: SCALE(88),
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: SCALE(28),
    color: '#333',
    fontWeight: 'bold',
  },
  infoText_: {
    flex: 1,
    fontSize: SCALE(24),
    color: '#737373',
    textAlign: 'right',
    paddingRight: SCALE(10)
  },
  infoImg: {
    width: SCALE(28),
    height: SCALE(28),
    resizeMode: 'contain',
    flexShrink: 0
  },
  infoHeader: {
    width: SCALE(108),
    height: SCALE(108),
    resizeMode: 'contain',
    flexShrink: 0
  },
  borderBottom: {
    position: 'relative',
    zIndex: 999999,
    height: SCALE(64),
    width: SCALE(500),
    ...layout.border(SCALE(1), '#e5e5e5', 'bottom')
  },
  input: {
    padding: 0,
    color: '#737373',
    height: SCALE(64),
    width: SCALE(500),
    fontSize: SCALE(32),
    marginLeft: 2,
  },
})