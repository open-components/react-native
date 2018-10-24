import React, { Component } from "react";
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
  TouchableHighlight,
  ImageBackground
} from "react-native";
import NavigationService from "../../../components/NavigationService";
import HeaderTitle from "../../../components/header";
import Toast from "../../../components/toast";

export default class BankCard extends Component {
  //构造函数
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // HttpUtil.GET('/my/detail').then(({ data }) => {
    // })
  }
  goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { navigate } = this.props.navigation;
    const { userInfo } = this.state;
    return (
      <View
        style={{
          flex: 1,
          height: HEIGHT,
          backgroundColor: "#fafafa",
          paddingTop: StatusBar.currentHeight + SCALE(88),
          alignItems: "center"
        }}
      >
        <Toast ref="toast" />
        <HeaderTitle
          title={"银行卡管理"}
          headerStyle={{ backgroundColor: "#fff" }}
          solid={true}
          titleStyle={{ color: "#333" }}
          _goBack={this.goBack}
        />
        <View style={styles.container}>
          <View
            style={{
              flex: 1
            }}
          >
            <View style={styles.card}>
              <ImageBackground
                resizeMode="contain"
                style={styles.bgImage}
                source={require("../../../resource/images/bankcard/jianshe.png")}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: SCALE(32),
                    lineHeight: SCALE(32),
                    marginTop: SCALE(66)
                  }}
                >
                  中国建设银行
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: SCALE(32),
                    lineHeight: SCALE(32),
                    marginTop: SCALE(45)
                  }}
                >
                  5799 **** **** **** 050
                </Text>
              </ImageBackground>
            </View>
            <View
              style={{
                alignItems: "center"
              }}
            >
              <Image
                style={styles.payIcon}
                source={require("../../../resource/images/bankcard/alipay.png")}
              />
              <Text
                style={{
                  fontSize: SCALE(24),
                  color: "#999",
                  marginTop: SCALE(20),
                  lineHeight: SCALE(24)
                }}
              >
                已绑定支付宝账号
              </Text>
              <Text
                style={{
                  fontSize: SCALE(36),
                  color: "#333",
                  marginTop: SCALE(20),
                  lineHeight: SCALE(36)
                }}
              >
                188 **** 1022
              </Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.bottomBtn}>
            <Text style={{
              color: '#26beff',
              fontSize : SCALE(32),
            }}>更改信息</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems : 'center'
  },
  card: {
    marginTop: SCALE(30),
    marginBottom: SCALE(80),
    width: WIDTH - SCALE(22) * 2,
    height: (WIDTH - SCALE(22) * 2) * 0.34,
    ...layout.shadow("#000", { w: SCALE(8), h: SCALE(8) }, 0.12, SCALE(32)),
    alignItems: "center",
    elevation: 8
  },
  bgImage: {
    width: WIDTH - SCALE(22) * 2,
    height: (WIDTH - SCALE(22) * 2) * 0.34,
    paddingLeft: SCALE(140)
  },
  payIcon: {
    width: SCALE(100),
    height: SCALE(100)
  },
  bottomBtn : {
    width : WIDTH - SCALE(30)*2,
    height : SCALE(88), 
    backgroundColor : '#fff',
    elevation: 2,
    borderRadius : SCALE(44),
    ...layout.shadow("#000", { w: SCALE(4), h: SCALE(4) }, 0.08, SCALE(20)),
    ...layout.margin(SCALE(30),SCALE(30)),
    justifyContent : 'center',
    alignItems : 'center'
  }
});
