import React, { Component } from 'react';
import styled from 'styled-components'
import axios from 'axios'
import swal from 'sweetalert';

import ServerInfo from '../../info/ServerInfo'

class MypageConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display : this.props.display,
      credential : this.props.credential,
      password : '',
      is_swal : false,
    }
    this.server_url = ServerInfo().location
  }
  componentDidMount(){
    window.addEventListener("keydown",this.handleEnterKey)
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      ...nextProps
    })
  }
  handleEnterKey=(e)=>{
    const {display, is_swal} = this.state
    if(e.keyCode===13 && display==='block' && is_swal===false){
      this.handleConfrim(e)
    }else if(is_swal===true){
      this.setState({
        is_swal : !is_swal
      })
    }
  }

  handleInput=(e)=>{
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleConfrim=(e)=>{
    const {credential, password,display, is_swal} = this.state
    this.setState({
      is_swal : !is_swal
    })
    if(password===''){
      swal({
        icon : 'warning',
        title : '아무값도 입력하지 않았습니다!',
      })
    }else if(display==='block'){
      axios({
        method:'post',
        url: this.server_url+'/mypage',
        params: {
          credential : credential,
          password : password,
        }
      }).then(res=>{
        if(res.data!=='err'){
          if(res.data==="fail"){
            swal({
              icon : 'warning',
              title : '비밀번호가 틀렸습니다!',
            })
          }else{
            this.props.onChange()
          }
        }else{
          localStorage.removeItem("name")
          localStorage.removeItem("credential")
          localStorage.removeItem("profile_image")
          window.location = '/'
        }
      })
    }
  }
  
  render() {
    const {password, display} = this.state
    return (
      <MypageConfirmController display={display}>
        <ConfirmMessage>비밀번호를 재확인 해주세요</ConfirmMessage>
        <ConfirmInputController>
          <ConfirmInput name="password" value={password} onChange={this.handleInput}  type="password"/>
          <ConfirmButton onClick={this.handleConfrim} className="btn btn-success">확인</ConfirmButton>
        </ConfirmInputController>
      </MypageConfirmController>
    );
  }
}


const MypageConfirmController = styled.div`
  display: ${dis=>dis.display};
  background-color : white;
  width : 300px;
  height : 300px;
  margin : 0 auto;
  border: 1px solid white;
`

const ConfirmMessage = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  color: #000000c2;
  margin-top: 100px;
`

const ConfirmInputController = styled.div`
  display: table;
  margin: 0 auto;
`

const ConfirmInput = styled.input`
  display: inline-block;
  margin-left: 10px;
  width: 150px;
  height: 35px;
  position: relative;
`

const ConfirmButton = styled.button`
  height: 35px;
  display: inline-block;
  position: relative;
  margin-left: 5px;
  margin-bottom: 5px;
`

export default MypageConfirm;