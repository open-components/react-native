import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Platform
} from 'react-native';
import "../utils/HttpUtil";
import Toast from "./toast";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackActions, NavigationActions } from 'react-navigation';
import LinearGradient from "react-native-linear-gradient";

export default class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      language: '简体中文',
      ms: 60,
      msg: '获取验证码',
      textDisabled: false,
      formData: [{
        title: '手机号',
        placeholder: '请输入手机号',
        value: '',
        maxLength: 11
      }, {
        title: '数字验证码',
        placeholder: '请输入右侧计算结果',
        value: '',
        maxLength: 11,
        checkNum: ''
      }, {
        title: '短信验证码',
        placeholder: '请输入短信验证码',
        value: '',
        maxLength: 6
      }]
    }
  }

  componentDidMount() {
    let toastInfo = this.props.navigation.state.params.toast;//显示路由参数提示
    toastInfo && this.refs.toast.show(toastInfo, 2000);
    this.getQuestion();//首次获取计算问题
  }

  //获取计算问题
  getQuestion = () => {///login/question
    HttpUtil.GET('/generate/number/code').then(res => {
      Log(res);
      if (res.code == 200) {
        this.state.formData[1].checkNum = res.data.numbercode;
        WRITE_CACHE('encryptstr', res.data.encryptstr);
        this.setState({
          formData: this.state.formData.concat()
        })
      } else {
        this.refs.toast.show(res.desc, 2000)
      }
    }).catch(err => this.refs.toast.show(JSON.stringify(err), 2000))
  }
  //输入框记录数据
  onPhoneChange(v, i) {
    this.state.formData[i].value = v;
    this.setState({
      formData: this.state.formData.concat()
    })
  }
  //请求验证码
  get_identify = () => {
    const phone = this.state.formData[0].value;
    const sendtype = 'login';
    let pattern = /0?(13|14|15|18|17|19)[0-9]{9}/;
    if (!pattern.test(phone)) {
      this.refs.toast.show(this.state.language == 'English' ? 'Please enter the correct number' : '请输入正确的电话号码', 2000);
      return
    }
    READ_CACHE('encryptstr', (res) => {//读取数字验证码加密字符串
      this.setState({//禁止按钮再次点击
        textDisabled: true,
      }, () => {
        const encryptstr = res;
        const numbercoderesult = this.state.formData[1].value;
        HttpUtil.POST('/send/sms/general', { phone, numbercoderesult, sendtype, encryptstr }).then(res => {//获取验证码
          this.refs.toast.show(res.desc + ':' + res.data, 2000);
          if (res.code != 500) {
            this._get_sms();
          } else {
            this.setState({
              textDisabled: false,
            })
          }
        }).catch(err => this.refs.toast.show(JSON.stringify(err), 2000))
      });
    }, () => {
      this.getQuestion();
      this.refs.toast.show(this.state.language == 'English' ? 'Digital verification code expired, please re-enter' : '数字验证码过期，请重新输入', 2000);
    })
  }
  _get_sms = () => {
    if (this._timer) { clearInterval(this._timer) };
    this._timer = setInterval(() => {
      if (this.state.ms > 0) {
        this.state.ms--;
        this.setState({
          ms: this.state.ms,
          msg: this.state.language == 'English' ? 'Wait ' + this.state.ms + ' s' : '等待' + this.state.ms + '秒'
        })
      } else {
        this.setState({
          ms: 60,
          msg: this.state.language == 'English' ? 'Get message' : '获取验证码',
          textDisabled: false,
        });
        this._timer && clearInterval(this._timer)
      }
    }, 1000);
  }
  login = () => {
    const phone = this.state.formData[0].value;
    const numbercoderesult = this.state.formData[1].value;
    const smscode = this.state.formData[2].value;
    READ_CACHE('encryptstr', (res) => {
      const encryptstr = res;
      HttpUtil.POST('/login', { phone, smscode, numbercoderesult, encryptstr }).then(res => {
        this.refs.toast.show(res.desc, 2000);
        if (res.code == 200) {//登录成功
          WRITE_CACHE('token', res.data.token);
          WRITE_CACHE('uid', res.data.uid);
          WRITE_CACHE('usertype', res.data.usertype);
          this.props.navigation.navigate('Mine');
        }
      }).catch(err => this.refs.toast.show('请求异常', 2000))
    }, () => { });
  }
  //切换语言
  changeLanguage = () => {
    let formData_ = [{
      title: this.state.language == 'English' ? '手机' : 'Phone',
      placeholder: this.state.language == 'English' ? '请输入手机号' : 'please enter the mobile number',
      value: '',
      maxLength: 11
    }, {
      title: this.state.language == 'English' ? '数字验证码' : 'Number Verification Code',
      placeholder: this.state.language == 'English' ? '请输入右侧计算结果' : 'please enter the results',
      value: '',
      maxLength: 11,
      checkNum: this.state.formData[1].checkNum
    }, {
      title: this.state.language == 'English' ? '短信验证码' : 'Message Verification Code',
      placeholder: this.state.language == 'English' ? '请输入短信验证码' : 'please enter message',
      value: '',
      maxLength: 6
    }];
    let msg_;
    if (this.state.ms == 60) {
      msg_ = this.state.language == 'English' ? '获取验证码' : 'Get message'
    } else {
      msg_ = this.state.msg;
    }
    this.setState({
      formData: formData_,
      language: this.state.language == 'English' ? '简体中文' : 'English',
      msg: msg_,
    })
  }
  componentWillUnmount() {
    this._timer && clearInterval(this._timer);
  }
  render() {
    const { formData, msg, textDisabled, language } = this.state;
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        colors={['#33ddff', '#19a2fc']}
        style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          hidden={false}  //是否隐藏状态栏。  
          backgroundColor={'transparent'} //状态栏的背景色   
          translucent={true}//指定状态栏是否透明。
          barStyle={'light-content'} // enum('default', 'light-content', 'dark-content')   
        >
        </StatusBar>
        <Toast ref='toast' />
        <View style={styles.topBar}>
          <Text style={styles.topText}>{language == 'English' ? 'Login' : '登录'}</Text>
          <Text style={styles.topText_} onPress={this.changeLanguage}>{language}</Text>
        </View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          style={{ width: WIDTH, height: HEIGHT - StatusBar.currentHeight - SCALE(88), position: 'relative' }}>
          <View style={styles.userImg}>
            <Image style={styles.userImg_} source={require('../resource/images/tabs/mall_fill.png')}></Image>
          </View>
          <LinearGradient
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            colors={['#33ddff', '#19a2fc']}
            style={{ width: WIDTH, height: SCALE(212) - StatusBar.currentHeight }}>
          </LinearGradient>
          <View style={styles.loginLayout}>
            {formData.map((e, i) =>
              <View key={'form' + i} style={styles.loginForm}>
                <View style={styles.formTitle}>
                  <Text style={styles.formTitle_}>{e.title}</Text>
                </View>
                <View style={styles.borderBottom}>
                  <TextInput
                    style={styles.input}
                    onChangeText={(value) => this.onPhoneChange(value, i)}
                    textAlignVertical={'center'}
                    keyboardType={'numeric'}
                    maxLength={e.maxLength}
                    placeholderTextColor={'#ccc'}
                    selectTextOnFocus={true}
                    underlineColorAndroid={'transparent'}
                    placeholder={e.placeholder}
                    selectionColor={'#33ddff'}>
                  </TextInput>
                  {i == 1
                    ?
                    <View style={styles.checkNum}>
                      <Text style={styles.checkNum_} onPress={this.getQuestion}>{e.checkNum}</Text>
                    </View>
                    : null}
                  {i == 2
                    ?
                    <View style={styles.identify}>
                      <Text style={styles.identify_} disabled={textDisabled} onPress={this.get_identify}>{msg}</Text>
                    </View>
                    : null}
                </View>
              </View>)}
            <View style={styles.actionsLayout}>
              <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={['#33ddff', '#19a2fc']}
                style={styles.actions}>
                <TouchableOpacity activeOpacity={0.7} onPress={this.login}>
                  <View style={styles.loginView}>
                    <Text style={styles.login}>{language == 'English' ? 'Login' : '登录'}</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Register')}>
                <View style={styles.register}>
                  <Text style={styles.register_}>{language == 'English' ? 'registe' : '注册'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  topBar: {
    marginTop: StatusBar.currentHeight,
    ...layout.padding(0, SCALE(30)),
    height: SCALE(88),
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  topText: {
    color: '#fff',
    fontSize: SCALE(40),
    fontWeight: 'bold',
  },
  topText_: {
    color: '#fff',
    fontSize: SCALE(24),
  },
  loginLayout: {
    width: WIDTH,
    height: HEIGHT - SCALE(300),
    backgroundColor: '#fff',
    borderTopLeftRadius: SCALE(30),
    borderTopRightRadius: SCALE(30),
    ...layout.padding(SCALE(180), SCALE(90), 0, SCALE(90)),
    justifyContent: 'flex-start',
  },
  loginForm: {
    height: SCALE(128),
  },
  userImg: {
    position: 'absolute',
    bottom: HEIGHT - SCALE(400),
    left: WIDTH / 2 - SCALE(100),
    width: SCALE(200),
    height: SCALE(200),
    borderRadius: 200,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        elevation: 24
      }, ios: {
        ...layout.shadow('#000', { w: 0, h: SCALE(16) }, 0.1, SCALE(24))
      }
    }),
  },
  userImg_: {
    width: SCALE(200),
    height: SCALE(200),
    borderRadius: 200,
    resizeMode: 'contain',
  },
  borderBottom: {
    position: 'relative',
    height: SCALE(64),
    ...layout.border(SCALE(1), '#e5e5e5', 'bottom')
  },
  checkNum: {
    position: 'absolute',
    height: SCALE(56),
    width: SCALE(160),
    borderRadius: SCALE(8),
    right: 0,
    top: SCALE(2),
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkNum_: {
    color: '#737373',
    fontSize: SCALE(32),
  },
  formItem: {
    height: SCALE(128),
  },
  formTitle: {
    height: SCALE(64),
    justifyContent: 'center'
  },
  formTitle_: {
    fontSize: SCALE(28),
    color: '#333',
    fontWeight: 'bold'
  },
  input: {
    padding: 0,
    color: '#737373',
    height: SCALE(64),
    fontSize: SCALE(32),
    marginLeft: 2,
  },
  identify: {
    position: 'absolute',
    right: 0,
    top: SCALE(10),
    width: SCALE(160),
    height: SCALE(44),
    borderRadius: 100,
    ...layout.border(SCALE(1), '#26beff', ''),
    justifyContent: 'center',
    alignItems: 'center'
  },
  identify_: {
    color: '#26beff',
    fontSize: SCALE(24)
  },
  actionsLayout: {
    ...layout.padding(SCALE(90), 0)
  },
  actions: {
    height: SCALE(88),
    borderRadius: 100,
    elevation: 4
  },
  loginView: {
    height: SCALE(88),
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: SCALE(36)
  },
  register: {
    marginTop: SCALE(40),
    height: SCALE(88),
    justifyContent: 'center',
    alignItems: 'center',
    ...layout.border(SCALE(1), '#ccc', ''),
    borderRadius: 100,
    backgroundColor: '#fff'
  },
  register_: {
    color: '#999',
    fontSize: SCALE(36)
  },
})