import React, { Component } from 'react';
import styled from 'styled-components'
import axios from 'axios'

import ServerInfo from '../info/ServerInfo'

import MypageUpdate from '../components/mypage/MypageUpdate';
import MypageConfirm from '../components/mypage/MypageConfirm';

class Mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      credential : '',
      profile_image : '',
      write_board_count : '',
      confirm : false,
      mypage_confirm : 'none',
      mypage_update : 'none'
    }
    this.mypage_controller = null
  }
 
  componentDidMount(){
    this.setState({
      name : localStorage.getItem("name"),
      credential : localStorage.getItem("credential"),
      profile_image : localStorage.getItem('profile_image'),
    })
    const {confirm} = this.state
    if(localStorage.getItem("credential")===null){
      alert("잘못된 접근입니다!")
      window.location = '/'
    }else{
      if(confirm){
        this.setState({
          mypage_update : 'block',
          mypage_confirm : 'none',
        })
      }else{
        this.setState({
          mypage_update : 'none',
          mypage_confirm : 'block',
        })
      }
    }
    if(localStorage.getItem("credential")===null){
      this.mypage_controller.remove()
    }else{
      axios({
        method : 'post',
        url : ServerInfo().location+'/mypage/counter',
        params : {
          credential : localStorage.getItem("credential")
        }
      }).then((res)=>{
        this.setState({
          write_board_count : res.data
        })
      }).catch((err)=>{
      })
    }
  }

  handleConfirm=()=>{
    this.setState({
      password : '',
      confirm : true,
      mypage_confirm : 'none',
      mypage_update : 'block',
    })
  }

  MypageUpdateChange=(e)=>{
    if(e.type==='name'){
      this.setState({
        name : e.value,
      })
      localStorage.setItem("name",e.value)
    }
  }

  
  
  render() {
    const {name, credential, mypage_confirm, profile_image, mypage_update,write_board_count} = this.state
    return (
      <MypageController ref={ref=>this.mypage_controller=ref}>
        <MypageUpdate 
        display={mypage_update} credential={credential} name={name} write_board_count={write_board_count}
        profile_image={profile_image} onChange={this.MypageUpdateChange}  />
        <MypageConfirm 
        display={mypage_confirm} credential={credential} onChange={this.handleConfirm} />        
      </MypageController>
    );
  }
}

const MypageController = styled.div`
  margin : 30px 100px 30px 100px;
  position : relative;
  background-color : white;
  border-radius : 12px;
`

export default Mypage;