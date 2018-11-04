import { Dimensions, PixelRatio, Platform ,StatusBar} from 'react-native';
import { Theme } from 'teaset'
import './storageInit'
import './HttpUtil'

export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度
let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例
let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;
//iphone6的像素密度
//px转换成dp
const defaultW = Platform.OS === 'ios' ? 750 : 720;
const defaultH = Platform.OS === 'ios' ? 1334 : 1280;
const w2 = defaultW / defaultPixel;
const h2 = defaultH / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);   //获取缩放比例

//noinspection JSAnnotator
/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
export function setSpText(size) {
  // size = size/pixelRatio;
  size = Math.round((size * scale) / fontScale);
  return size;
}

//noinspection JSAnnotator
export function scaleSize(size) {
  // size = Math.round(size * scale + 0.5);
  size = Math.round(size * scale);
  return size / defaultPixel;
}

export function Log(...params) {
  if (__DEV__) {
    // debug模式
    console.log(...params)
  } else {
    // release模式
    // Log('release模式');
  }
}

global.paddingTop = ()=>{
  if(Theme.isIPhoneX){
    return scaleSize(80)
  }else{
    return StatusBar.currentHeight
  }
};

global.isIPhoneX = Theme.isIPhoneX;

global.FONT = setSpText;

global.SCALE = scaleSize;

global.WIDTH = deviceWidth;

global.HEIGHT = deviceHeight;

global.Log = Log;

global.layout = {
  margin(...arg) {
    let margin = {}
    switch (arg.length) {
      case 1:
        margin = {
          marginTop: arg[0],
          marginRight: arg[0],
          marginBottom: arg[0],
          marginLeft: arg[0],
        }
        break;

      case 2:
        margin = {
          marginVertical: arg[0],
          marginHorizontal: arg[1],
        }
        break;

      case 3:
        margin = {
          marginTop: arg[0],
          marginHorizontal: arg[1],
          marginBottom: arg[2],
        }
        break;

      case 4:
        margin = {
          marginTop: arg[0],
          marginRight: arg[1],
          marginBottom: arg[2],
          marginLeft: arg[3],
        }
        break;

      default:
        break;
    }
    return margin
  },
  padding(...arg) {
    let padding = {}
    switch (arg.length) {
      case 1:
        padding = {
          paddingTop: arg[0],
          paddingRight: arg[0],
          paddingBottom: arg[0],
          paddingLeft: arg[0],
        }
        break;

      case 2:
        padding = {
          paddingVertical: arg[0],
          paddingHorizontal: arg[1],
        }
        break;

      case 3:
        padding = {
          paddingTop: arg[0],
          paddingHorizontal: arg[1],
          paddingBottom: arg[2],
        }
        break;

      case 4:
        padding = {
          paddingTop: arg[0],
          paddingRight: arg[1],
          paddingBottom: arg[2],
          paddingLeft: arg[3],
        }
        break;

      default:
        break;
    }
    return padding
  },
  border(width, color, direction) {
    let border = {}
    switch (direction) {
      case 'top':
        border = {
          borderTopWidth: width,
          borderColor: color
        }
        break;

      case 'right':
        border = {
          borderRightWidth: width,
          borderColor: color
        }
        break;

      case 'bottom':
        border = {
          borderBottomWidth: width,
          borderColor: color
        }
        break;

      case 'left':
        border = {
          borderLeftWidth: width,
          borderColor: color
        }
        break;

      case '':
        border = {
          borderWidth: width,
          borderColor: color
        }
        break;
      default:
        break;
    }
    return border
  },
  shadow(color, offset, opacity, radius) {
    return {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius
    }
  }
}