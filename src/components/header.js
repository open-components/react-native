import React, { Component } from 'react';
import {
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

export default class HeaderTitle extends Component{
  constructor(){
    super()
  }
  _goBack = ()=>{
    this.props._goBack()
  }
  _clickRight = ()=>{
    this.props.headerRight && this.props.headerRight.cb && this.props.headerRight.cb();
  }
  render(){
    const {title,headerRight,titleStyle,headerStyle,rightStyle,solid} = this.props;
    const img = solid ? require('../resource/images/backIcon_.png') : require('../resource/images/backIcon.png');
    const solidStyle = solid ? layout.border(SCALE(1),'#e6e6e6','bottom') : {};
    return (
      <View style={{...solidStyle,position:'absolute',top:0,left:0,height:SCALE(88),zIndex:999,width:WIDTH,flexDirection: 'row',alignItems: 'center',justifyContent:'space-between',marginTop:StatusBar.currentHeight,...layout.padding(0,SCALE(30)),...headerStyle,}}>
        <TouchableOpacity activeOpacity={0.8} onPress={this._goBack}>
            <View style={{width:SCALE(120),flexShrink:0}}>
                <Image source={img}/>
            </View>
        </TouchableOpacity>
        <Text style={{color:'#fff',fontSize:SCALE(36),flex:1,textAlign:'center',...titleStyle}}>{title ? title : ''}</Text>
        {headerRight ? 
        <TouchableOpacity activeOpacity={0.8}  onPress={this._clickRight}>
          {typeof headerRight.title == 'string'
           ? 
           <Text 
            style={{width:SCALE(120),color:'#fff',fontSize:SCALE(28),flexShrink:0,textAlign:'right',...rightStyle,}}>
            {headerRight.title}
           </Text>
           :
           <View style={{width:SCALE(120),flexShrink:0,...rightStyle}}>
            <Image source={headerRight.title} style={{alignSelf:'flex-end',width:SCALE(35),height:SCALE(35)}}></Image>
           </View>
          }
        </TouchableOpacity>
        :
        <View style={{width:SCALE(120),flexShrink:0}}></View>
        }
      </View>
    )
  }
}