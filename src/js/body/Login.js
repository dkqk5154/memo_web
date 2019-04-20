import React, {Fragment, Component } from 'react';
import styled, {} from 'styled-components'
import axios from "axios"
import ServerInfo from '../info/ServerInfo'

class Login extends Component {
  constructor(props){
    super(props);
    this.state ={
      background_random_video : "",
      background_class_name : "",
      userid : "",
      password : "",
      alarm : {
        color : "",
        value1 : "",
        value2 : "",
      },
      login_box_color : '#ffffffe3'
    }
    this.background_video = null 
    this.login_fail = "아이디 또는 비밀번호를 확인해주세요"
    this.login_no_userid = "아이디가 입력되지 않았습니다!"
    this.login_no_password = "비밀번호가 입력되지 않았습니다!"
    this.server_url = ServerInfo().location
  }

  handleEnterKey=(e)=>{
    if(e.keyCode===13){
      this.handleLoginSubmit()
    }
  }

  componentWillMount(){
    while(true){
      const num = parseInt(Math.random()*10)
      if(num!==0 && num<3){
          this.setState({
            ...this.state,
            background_random_video : num
          })
          return
      }
    }
  }
  
  componentDidMount(){
    window.addEventListener("keydown",this.handleEnterKey)
    const agent = navigator.userAgent.toLowerCase();
    if((navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) || (agent.indexOf("msie") !== -1)) {
      this.setState({
        login_box_color : 'white'
      })
    }
    if(window.navigator.userAgent.indexOf("Edge") > -1){
      this.setState({
        login_box_color : 'white'
      })
    }
  }

  handleInput=(e)=>{
    const et = e.target
    this.setState({
      [et.id] : et.value
    })
  }

  handleLoginSubmit=()=>{
    const {userid, password} = this.state
    if(userid===""){
      this.setState({
        alarm : {
          color : 'red',
          value1 : this.login_no_userid
        }
      })
    }else if(password===""){
      this.setState({
        alarm : {
          color : 'red',
          value1 : this.login_no_password
        }
      })
    }else{
      axios({
        method: "post",
        url: this.server_url+"/login",
        params: {
          userid : userid, 
          password : password,
        },
      })
      .then((r)=> {
        let res = r.data
        if(res==="fail"){
          this.setState({
            alarm : {
              color : 'red',
              value1 : this.login_fail.split(",")[0],
              value2 : this.login_fail.split(",")[1],
            }
          })
        }else{
          localStorage.setItem("name",res.name)
          localStorage.setItem("credential",res.credential)
          localStorage.setItem("profile_image",res.profile_image)
          window.location = '/'
        }
      })
      .catch((err)=>{console.log(err)})
    }
  }

  handleClickRegister=()=>{
    window.location='/register'
  }

  render() {
    const {userid, password, background_random_video,alarm,login_box_color} = this.state

    return (
      <Fragment>
        <BackButtonController>
          <BackButtonImg src={require('../../img/pad.png')}/>
          <BackButton href="/">MeMo</BackButton>
        </BackButtonController>
        <FormLogin color={login_box_color}>
          <Header>
            <Title>로그인</Title>
          </Header>
          <BodyLogin>
            <InputLogin
              id="userid" value={userid} onChange={this.handleInput}
              type="text" placeholder="아이디 입력"
            />
            <InputLogin 
              id="password" value={password} onChange={this.handleInput}
              type="password" placeholder="비밀번호 입력"
            />
            <Alaram marginTop="15px" color={alarm.color}>{alarm.value1}</Alaram>
            <Alaram marginTop="5px" color={alarm.color}>{alarm.value2}</Alaram>
            <LoginButton onClick={this.handleLoginSubmit} className="btn btn-primary">로그인</LoginButton>
           <RegisterButton onClick={this.handleClickRegister} className="btn btn-success">회원가입</RegisterButton>
          </BodyLogin>
        </FormLogin>
        <div ref={ref=>this.background_video=ref}>
          <VideoLogin autoPlay loop muted>
            <source src={require("../../video/loop"+background_random_video+".mp4")} type="video/mp4"/>
          </VideoLogin>
        </div>
      </Fragment>
    );
  }
}

const BodyLogin = styled.div`
  margin: 0 auto;
  margin-top: 30px;
  width: 300px;
  height: 400px;
`

const VideoLogin = styled.video`
  position: fixed; 
  right: 0; 
  bottom: 0;
  min-width: 100%; 
  min-height: 100%;
  width: auto; 
  height: auto; 
  z-index: -100;
  background: no-repeat;
  background-size: cover;
` 

const FormLogin = styled.div`
  position: relative;
  margin: 0 auto;
  margin-top : -8px;
  background-color: ${dis=>dis.color};
  width: 400px;
  border-radius: 8px;
`

const InputLogin = styled.input`
  display: block;
  width: 100%;
  height: 45px;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
  -webkit-transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  margin-top : 15px;
`

const Header = styled.div`
  margin-top: 10px;
  text-align: center;
`
const BackButtonController = styled.div`
  position : relative;
  width : 150px;
  margin-left : 10px;
  margin-top : 10px;
  border-radius : 8px;
`

const BackButtonImg = styled.img`
  margin-left : 7px;
  margin-bottom : 5px;
  width: 40px;
`
const BackButton = styled.a`
  font-family: 'Anton', sans-serif;
  color: white;
  position: relative;
  top: 5px;
  left: 4px;
  font-size: 30px;
  font-weight: bold;
  : hover {
    text-decoration: none;
    color : white;
  }
`
const LoginButton = styled.button`
  margin-top : 12px;
  width : 100%;
  height : 40px;
`
const RegisterButton = styled.button`
  margin-top : 12px;
  margin-bottom : 10px;
  width : 100%;
  height : 40px;
`
const Title = styled.p`
  font-weight: bold;
  position: relative;
  font-size: 45px;
  top: 20px;
`

const Alaram = styled.p`
  margin-left : 5px;
  margin-top : ${dis=>dis.marginTop};
  margin-bottom : 0px;
  color : ${dis=>dis.color};
`



export default Login;