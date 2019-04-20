import React, { Component, Fragment } from 'react';
import * as rc from 'reactstrap';
import styled, { css } from 'styled-components'
import axios from 'axios';
import swal from 'sweetalert2'

import ServerInfo from '../../info/ServerInfo'


class BoardForm extends Component {v
  constructor(props) {
    super(props);
    this.state ={
      credential : '',
      title : '',
      title_max : 15,
      content : '',
      content_max : 300,
      collapse: false, 
      edit : false,
      textNum : 0,
    }
    this.not_login = '비로그인'
    this.board_sw = true
    this.server_url = ServerInfo().location
  }
  
  componentDidMount(){
    if(localStorage.getItem('credential')===null){
      this.setState({
        credential : this.not_login
      })
    }else{
      this.setState({
        credential : localStorage.getItem('credential')
      })
    }
  }

  handleSubmit=(e)=>{
    e.preventDefault()
    const {credential,title,content} = this.state
    if(title===''){
      swal.fire({
        type: 'warning',
        title: '제목을 작성해주세요!',
      })
    }else if(content===''){
      swal.fire({
        type: 'warning',
        title: '내용을 작성해주세요!',
      })
    }else if(credential===this.not_login){
      swal.fire({
        type: 'warning',
        html : '<h2 class="swal2-title">비회원은 글을</h2>'
        +'<h2 class="swal2-title">작성하실수 없습니다!</h2>'
      })
    }else{
      if(this.board_sw){
        this.board_sw=false
        axios({
          method : 'post',
          url : this.server_url+'/board/create',
          params : {
            credential : credential,
            title : title,
            content : content
          }
        }).then((res)=>{
          if(res.data!=='err'){
            window.location='/'
            this.board_sw=true
          }else{
            localStorage.removeItem("name")
            localStorage.removeItem("credential")
            localStorage.removeItem("profile_image")
            window.location = '/'
          }
        })
      }
    }
  }

  handleChange=(e)=>{
    const {content_max} = this.state
    if(e.target.value.length<content_max){
      this.setState({
        [e.target.name] : e.target.value
      })
    }else{
      this.setState({
        [e.target.name] : this.state.content
      })
    }
    this.setState({
      id : localStorage.getItem('credential'),
      textNum : e.target.value.length,
    })
  }

  render() {
    const {title_max,content_max} = this.state
    return (
      <Fragment>
        <rc.Input 
          id="title" name="title" onChange={this.handleChange} 
          value={this.state.title} maxLength={title_max} 
          placeholder="Title..." 
        />
        <Margin up/>
        <rc.Input type="textarea" 
          name="content"
          id="content" 
          rows="7"
          placeholder="Comment..." 
          onChange={this.handleChange}
          value={this.state.content}
        />
        <Float right>{this.state.textNum}/{content_max}</Float>
        <Button className="btn btn-success" onClick={this.handleSubmit}>입력완료</Button>
      </Fragment>
    );
  }
}

export default BoardForm;

const Button = styled.button`
    width : 100%;
    marginTop : 10px;
    `
    const Float = styled.div`
    ${props => props.right &&
      css`
        float: right;
    `};
    ${props => props.left &&
    css`
      float: left;
    `};
    `
    const Margin = styled.div`
      margin : 10px 10px 10px 10px;
      ${props => props.up &&
        css`
        margin : 10px 0px 0px 0px;
        `};
    `