import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Text,
  TextInput,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ToastAndroid,
  Platform
} from 'react-native';
import "../utils/HttpUtil";
import Toast from "./toast";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from "react-native-linear-gradient";

export default class Register extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      ms: 60,
      msg: '获取验证码',
      textDisabled: false,
      formData: [{
        title: '手机号',
        placeholder: '请输入手机号',
        value: '',
        maxLength: 11,
        err: ''
      }, {
        title: '推荐人',
        placeholder: '请输入推荐人手机号',
        value: '',
        maxLength: 11,
        err: ''
      }, {
        title: '支付密码',
        placeholder: '请输入支付密码',
        value: '',
        maxLength: 6,
        payWord: true,
        err: ''
      }, {
        title: '确认支付密码',
        placeholder: '请再次输入支付密码',
        value: '',
        maxLength: 6,
        payWord: true,
        err: ''
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
    this.getQuestion();//首次获取计算问题
  }

  //打开用户协议
  protocol() {
    HttpUtil.GET('/register/protocol').then(res => {
      console.log(res)
      // Linking.openURL(res)
    }).catch(err => this.refs.toast.show(JSON.stringify(err), 2000))
  }
  //获取计算问题
  getQuestion = () => {
    HttpUtil.GET('/generate/number/code').then(res => {
      if (res.code == 200) {
        this.state.formData[4].checkNum = res.data.numbercode;
        WRITE_CACHE('encryptstrRegister', res.data.encryptstr);
        this.setState({
          formData: this.state.formData.concat()
        })
      } else {
        this.refs.toast.show(res.desc, 2000)
      }
    }).catch(err => {console.log(err);this.refs.toast.show('请求异常', 2000)})
  }
  //输入框记录数据
  onPhoneChange(v, i) {
    if (i < 2) {//手机号及推荐人验证
      const phone = v;
      let pattern = /0?(13|14|15|18|17|19)[0-9]{9}/;
      this.state.formData[i].err = pattern.test(phone) ? '' : '手机号码格式不正确';//提示文字
    }
    this.state.formData[i].value = v;
    this.setState({
      formData: this.state.formData.concat()
    }, () => {
      if (i == 2 || i == 3) {//回调验证两次输入的支付密码是否相同
        let flag = this.state.formData[2].value == this.state.formData[3].value;
        this.state.formData[2].err = flag ? '' : '两次密码不一致';//提示文字
        this.state.formData[3].err = flag ? '' : '两次密码不一致';//提示文字
        this.setState({
          formData: this.state.formData.concat()
        })
      }
    })
  }
  //请求验证码
  get_identify = () => {
    const phone = this.state.formData[0].value;
    const sendtype = 'register';
    let pattern = /0?(13|14|15|18|17|19)[0-9]{9}/;
    if (!pattern.test(phone)) {
      this.refs.toast.show('请输入正确的电话号码', 2000);
      return
    }
    READ_CACHE('encryptstrRegister', (res) => {
      this.setState({
        textDisabled: true,
      }, () => {
        const encryptstr = res;
        const numbercoderesult = this.state.formData[4].value;
        HttpUtil.POST('/send/sms/general', { phone, numbercoderesult, sendtype, encryptstr }).then(res => {
          this.refs.toast.show(res.desc + ':' + res.data, 2000);
          if (res.data == '发送成功') {
            this._get_sms();
          } else {
            this.getQuestion();//计算错误，重新获取验证码
            this.setState({
              textDisabled: false,
            })
          }
        }).catch(err => this.refs.toast.show(JSON.stringify(err), 2000))
      });
    }, () => {
      this.getQuestion();
      this.refs.toast.show('数字验证码过期，请重新输入', 2000);
    });
  }
  //倒计时
  _get_sms = () => {
    if (this._timer) { clearInterval(this._timer) };
    this._timer = setInterval(() => {
      if (this.state.ms > 0) {
        this.state.ms--;
        this.setState({
          ms: this.state.ms,
          msg: '等待' + this.state.ms + '秒'
        })
      } else {
        this.setState({
          ms: 60,
          msg: '获取验证码',
          textDisabled: false,
        });
        this._timer && clearInterval(this._timer)
      }
    }, 1000);
  }
  //提交
  submit = () => {
    const sendtype = 'register';
    const phone = this.state.formData[0].value;
    const recomphone = this.state.formData[1].value;
    const paypass = this.state.formData[2].value;
    const twopaypass = this.state.formData[3].value;
    const numbercoderesult = this.state.formData[4].value;
    const smscode = this.state.formData[5].value;
    READ_CACHE('encryptstrRegister', (res) => {
      const encryptstr = res;
      HttpUtil.POST('/register', { phone, recomphone, paypass, twopaypass, smscode, numbercoderesult, sendtype, encryptstr }).then(res => {
        this.refs.toast.show(res.desc, 2000);
        if (res.code == 200) {//注册成功
          WRITE_CACHE('token', res.data.token);
          WRITE_CACHE('uid', res.data.uid);
          WRITE_CACHE('usertype', res.data.usertype);
          this.props.navigation.navigate('Mine');
        }
      }).catch(err => this.refs.toast.show(JSON.stringify(err), 2000))
    }, () => {
      this.getQuestion();
      this.refs.toast.show('数字验证码过期，请重新输入', 2000);
    })
  }
  componentWillUnmount() {
    this._timer && clearInterval(this._timer);
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }
  render() {
    const { formData, msg, textDisabled } = this.state;
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
        <Toast ref='toast'></Toast>
        <View style={styles.topBar}>
          <Text style={styles.topText}>注册</Text>
          <Text style={styles.topText_} onPress={() => this.props.navigation.goBack()}>返回登录</Text>
        </View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          style={{ width: WIDTH, height: HEIGHT - StatusBar.currentHeight - SCALE(88), position: 'relative' }}>
          <View style={styles.loginLayout}>
            {formData.map((e, i) =>
              <View key={'form' + i} style={styles.loginForm}>
                <View style={styles.formTitle}>
                  <Text style={styles.formTitle_}>{e.title}
                    <Text style={styles.formTitle__}>  {e.err}</Text>
                  </Text>
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
                    secureTextEntry={e.payWord ? true : false}
                    iosreturnKeyType={'next'}
                    selectionColor={'#33ddff'}>
                  </TextInput>
                  {i == 4
                    ?
                    <View style={styles.checkNum}>
                      <Text style={styles.checkNum_} onPress={this.getQuestion}>{e.checkNum}</Text>
                    </View>
                    : null}
                  {i == 5
                    ?
                    <TouchableOpacity style={styles.identify} activeOpacity={0.7}>
                      <Text style={styles.identify_} disabled={textDisabled} onPress={this.get_identify}>{msg}</Text>
                    </TouchableOpacity>
                    : null}
                </View>
              </View>)}
            <View style={styles.actionsLayout}>
              <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={['#33ddff', '#19a2fc']}
                style={styles.actions}>
                <TouchableOpacity activeOpacity={0.7} onPress={this.submit}>
                  <View style={styles.loginView}>
                    <Text style={styles.login}>提交</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
              <Text style={styles.register}>注册即表示同意
                <Text style={styles.register_} onPress={() => this.protocol()}>《用户协议》</Text>
              </Text>
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
    height: HEIGHT - StatusBar.currentHeight - SCALE(88),
    backgroundColor: '#fff',
    ...layout.padding(SCALE(94), SCALE(90), 0, SCALE(90)),
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
        ...layout.shadow('#000', { width: 0, height: SCALE(16) }, 0.1, SCALE(24))
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
  formTitle__: {
    marginLeft: SCALE(20),
    fontSize: SCALE(24),
    color: '#e74444',
    fontWeight: 'normal'
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
    ...layout.padding(SCALE(60), 0)
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
    marginTop: SCALE(30),
    alignSelf: 'center',
    color: '#737373'
  },
  register_: {
    color: '#26beff'
  },
})