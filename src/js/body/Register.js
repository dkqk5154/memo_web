import React, {Fragment, Component } from "react";
import styled, {} from "styled-components"
import axios from "axios"
import swal from 'sweetalert2';

import ServerInfo from '../info/ServerInfo'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      background_random_video: '',
      name : {
        color : "yellow",
        value : "",
        alarm : "",
      },
      id : {
        color : "yellow",
        value : "",
        alarm : "",
      },
      password : {
        color : "yellow",
        value : "",
        alarm : "",
      },
      confirm : {
        color : "yellow",
        value : "",
        alarm : "",
      },
      overlap_names : ["arr","names"],
      overlap_ids : ["arrarr"],
      register_box_color : '#ffffffe3'
    };
    this.password_err = "비밀번호는 6자이상 12자 이하로 정해주세요"
    this.password_confirm_err = "비밀번호가 일치하지 않습니다"
    this.password_success = "비밀번호가 일치합니다"
    this.id_err="아이디는 6자 이상 20자 이하로 해주세요"
    this.register_success="가입 완료"
    this.overlap_name_err="중복된 닉네임입니다"
    this.overlap_id_err="중복된 아이디입니다"
    this.empty_swal_err = "빈칸을 확인해 주세요"
    this.name_swal_err = "닉네임 칸을 확인해 주세요"
    this.id_swal_err = "아이디 칸을 확인해 주세요"
    this.password_swal_err = "비밀번호 칸을 확인해 주세요"
    this.password_swal_confirm_err = "비밀번호 재확인 칸을 확인해 주세요"
    this.background_video = null 
    this.server_url = ServerInfo().location
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
        register_box_color : 'white'
      })
    }
    if(window.navigator.userAgent.indexOf("Edge") > -1){
      this.setState({
        register_box_color : 'white'
      })
    }
  }

  handleRegister=(e)=> {
    e.preventDefault()
    const {name, id, password, confirm, overlap_names, overlap_ids} = this.state
    if (name.color==="yellow" || id.color==="yellow" || password.color==="yellow" || confirm.color==="yellow"){
      swal.fire({
        title : this.empty_swal_err,
        type : "warning",
      })
    }else if(name.color==="red"){
      swal.fire({
        title: this.name_swal_err,
        type: "warning",
      })
    }else if(id.color==="red"){
      if(id.alarm===this.id_err){
        swal.fire({
          title : this.id_swal_err,
          type : "warning"
        })
      }
    }else if (password.color==="red"){
      swal.fire({
        title : this.password_swal_err,
        type : "warning"
      })
    }else if (confirm.color==="red"){
        swal.fire({
          title : this.password_swal_confirm_err,
          type : "warning"
      })
    }else if(id.color==="green" || password.color==="green" || confirm.color==="green"){
      axios({
        method: "post",
        url: this.server_url+"/register",
        params: {
          name : name.value,
          userid : id.value,
          password : password.value,
        }
      })
      .then((response)=> {
        if(response.data.type==="name"){
          this.setState({
            ...this.state,
            overlap_names : overlap_names.concat(
              ...overlap_ids,response.data.value
            )
          });
          swal.fire({
            title : this.overlap_name_err,
            type : "warning"
          })
        }else if(response.data.type==="userid"){
          this.setState({
            ...this.state,
            overlap_ids : overlap_ids.concat(
              ...overlap_ids,response.data.value
            )
          });
          swal.fire({
            title : this.overlap_id_err,
            type : "warning"
          })
        }else{
          swal.fire({
            title : '가입 완료!',
            type : "success"
          }).then(()=>{
            window.location = "/login"
          })
        }
      })
      .catch((error)=> {
        console.log(error)
      });
    }
  }


  handleChange=(e)=>{
    const idPattern = /^[@|.|a-z|A-Z|0-9|]+$/ 
    const passwordPattern = /^[a-z|A-Z|0-9|]+$/ 
    const namePattern = /^[가-힣|a-z|A-Z|0-9|]+$/ 
    const et = e.target
    const {name, id, password, confirm, overlap_names, overlap_ids} = this.state
    if(et.id==="name"){
      if(namePattern.exec(et.value)){
        if(et.value.length<=8){
            if(overlap_names.some(val=>val===et.value)){
              this.setState({
                ...this.state,
                name: ({ 
                  ...name,
                  alarm : this.overlap_name_err,
                  color : "red",
                  value : et.value,
                }),
              })
            }else{
              this.setState({
                ...this.state,
                name: ({ 
                  ...name,
                  alarm : "좋은 닉네임 입니다!",
                  color : "green",
                  value : et.value,
                }),
              })
            }
        }else{
          this.setState({
            ...this.state,
            name: ({
              ...name,
              alarm : "닉네임은 8자 이하로 해주세요!",
              color : "red",
              value : et.value,
            })
          })
        }
      }else{
        if(et.value.length===0){
          this.setState({
            ...this.state,
            name: ({ 
              ...name,
              alarm : "",
              color : "yellow",
              value : et.value,
            }),
          })
        }else{
          this.setState({
            ...this.state,
            name: ({ 
              ...name,
              alarm : "글자기호, 특수기호 사용불가 입니다!",
              color : "red",
              value : et.value,
            }),
          })
        }
      }
    }
    if(et.id==="id"){
      if(idPattern.exec(et.value)){
        if(et.value.length>=6 && et.value.length<=20){
            if(overlap_ids.some(val=>val===et.value)){
              this.setState({
                ...this.state,
                id: ({ 
                  ...id,
                  alarm : this.overlap_id_err,
                  color : "red",
                  value : et.value,
                }),
              })
              return true;
            }else{
              this.setState({
                ...this.state,
                id: ({ 
                  ...id,
                  alarm : "좋은 아이디 입니다!",
                  color : "green",
                  value : et.value,
                }),
              })
            }
        }else{
          this.setState({
            ...this.state,
            id: ({
              ...id,
              alarm : this.id_err,
              color : "red",
              value : et.value,
            })
          })
        }
      }else{
        if(et.value.length===0){
          this.setState({
            ...this.state,
            id: ({ 
              ...id,
              alarm : "",
              color : "yellow",
              value : et.value,
            }),
          })
        }else{
          this.setState({
            ...this.state,
            id: ({ 
              ...id,
              alarm : "특수기호(@,. 제외), 한글은 사용불가 입니다!",
              color : "red",
              value : et.value,
            }),
          })
        }
      }
    } 
    if(et.id==="password"){
      if(passwordPattern.exec(et.value)){
        if(et.value.length>=6 && et.value.length<=12){
          this.setState({
            ...this.state,
            password: ({ 
              ...password,
              alarm : "가능한 비밀번호 입니다!",
              color : "green",
              value : et.value,
            }),
          })
        }else{
          if(confirm.value!==et.value){
            if(confirm.value===""){
              this.setState({
                ...this.state,
                confirm : ({
                  ...confirm,
                  alarm : "",
                  color : "yellow",
                }),
                password: ({
                  ...password,
                  alarm : "비밀번호는 6자이상 12자 이하로 정해주세요",
                  color : "red",
                  value : et.value,
                })
              })
            }else{
              this.setState({
                ...this.state,
                confirm : ({
                  ...confirm,
                  alarm : this.password_confirm_err,
                  color : "red",
                }),
                password: ({
                  ...password,
                  alarm : "비밀번호는 6자이상 12자 이하로 정해주세요",
                  color : "red",
                  value : et.value,
                })
              })
            }
          }else if(confirm.value===et.value){
            this.setState({
              ...this.state,
              confirm : ({
                ...confirm,
                alarm : "비밀번호가 일치합니다!",
                color : "green",
              }),
              password: ({
                ...password,
                alarm : "비밀번호는 6자이상 12자 이하로 정해주세요",
                color : "red",
                value : et.value,
              })
            })
          }
        }
      }else{
        if(et.value.length===0){
          this.setState({
            ...this.state,
            password: ({ 
              ...password,
              alarm : "",
              color : "yellow",
              value : et.value,
            }),
            confirm : ({
              ...confirm,
              alarm : "",
            })
          })
        }else{
          this.setState({
            ...this.state,
            password: ({ 
              ...password,
              alarm : "특수기호, 한글은 사용불가 입니다!",
              color : "red",
              value : et.value,
            }),
          })
        }
      }
    }
    if(et.id==="confirm"){
      if(et.value===""){
        this.setState({
          ...this.state,
          confirm : ({
            ...confirm,
            color : "yellow",
            alarm : "",
            value : et.value
          })
        })
      }else if(et.value!==password.value){
        this.setState({
          ...this.state,
          confirm : ({
            ...confirm,
            color : "red",
            alarm : this.password_confirm_err,
            value : et.value,
          })
        })
      }else if(et.value===password.value){
        this.setState({
          ...this.state,
          confirm : ({
            ...confirm,
            color : "green",
            alarm : this.password_success,
            value : et.value,
          })
        })
      }
    }
  }

  handleEnterKey=(e)=>{
    if(e.keyCode===13){
      this.handleRegister(e)
    }
  }
  
  handleClickLogin=()=>{
    window.location='/login'
  }

    
  render() {
    const {id,confirm,password, name, background_random_video,register_box_color} = this.state

    return (
      <Fragment>
        <BackButtonController>
          <BackButtonImg src={require('../../img/pad.png')}/>
          <BackButton href="/">MeMo</BackButton>
        </BackButtonController>
        <FormRegister color={register_box_color}>
          <Header>
            <Title>회원가입</Title>
          </Header>
          <Body>
            <RegisterInput
                value={name.value} 
                onChange={this.handleChange} 
                id="name" placeholder="닉네임을 입력해주세요"/>
            <Alaram color={name.color}>{name.alarm}</Alaram>
            <RegisterInput
              value={id.value} 
              onChange={this.handleChange} 
              id="id"placeholder="아이디를 입력해주세요"/>
            <Alaram color={id.color}>{id.alarm}</Alaram>
            <RegisterInput 
              value={password.value} 
              onChange={this.handleChange}  type="password"
              id="password" placeholder="비밀번호를 입력해주세요" />
            <Alaram color={password.color}>{password.alarm}</Alaram>
            <RegisterInput 
              value={confirm.value}
              onChange={this.handleChange}  type="password"
              id="confirm" placeholder="비밀번호 재확인" />
            <Alaram color={confirm.color}>{confirm.alarm}</Alaram>
            <RegisterSubmit onClick={this.handleRegister} className="btn btn-success">가입완료</RegisterSubmit>
            <BackLogin onClick={this.handleClickLogin} className="btn btn-primary">로그인 페이지로</BackLogin>
          </Body>
        </FormRegister>
        <div ref={ref=>this.background_video=ref}>
          <VideoRegister autoPlay loop muted>
            <source src={require("../../video/loop"+background_random_video+".mp4")} type="video/mp4"/>
          </VideoRegister>
        </div>
      </Fragment>
    );
  }
}

const Body = styled.div `
  margin: 0 auto;
  margin-top : 80px;
  width : 321px;
`

const RegisterInput = styled.input`
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
`
const FormRegister = styled.div`
  position: relative;
  margin: 0 auto;
  margin-top : -8px;
  background-color: ${dis=>dis.color};
  width: 400px;
  border-radius: 8px;
`
  
const VideoRegister = styled.video`
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
const Header = styled.div`
  margin-top: 10px;
  text-align: center;
`
const Alaram = styled.p`
  margin-left : 5px;
  margin-top : 15px;
  color : ${dis=>dis.color};
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
const Title = styled.h1`
  position: relative;
  top: 55px;
  font-weight: bold;
`

const RegisterSubmit = styled.button`
  width : 100%;
`

const BackLogin = styled.button`
  width : 100%;
  margin-top : 10px;
  margin-bottom : 30px;
`

export default Register;