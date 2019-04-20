import React, { Component, Fragment } from 'react';
import * as rs from 'reactstrap';
import styled, {css} from 'styled-components'
import axios from 'axios';
import swal from 'sweetalert2'

import ServerInfo from '../../info/ServerInfo'



class BoardInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title : this.props.info.title,
      content : this.props.info.content,
      credential : '',
      edit : false,
      content_length : 0,
      no : this.props.info.no,
      register_date : '',
      register_time : '',
      update_date : '',
      update_time : '',
      content_max : 300,
      title_max : 30,
      collapse : true,
      edit_switch : false, 
    }
    this.toggle = this.toggle.bind(this)
    this.not_login_update_message = '비회원은 수정할수 없어요!'
    this.not_login_remove_message = '비회원은 삭제할수 없어요!'
    this.confirm_remove_mewssage = '삭제되었습니다'
    this.server_url = ServerInfo().location
  }
  
  componentDidMount(){
    let {register_date, update_date} = this.props.info
    let register = this.makeDateForm(register_date)
    let update = this.makeDateForm(update_date)
    this.setState({
      credential : localStorage.getItem('credential'),
      register_date : register.date,
      register_time : register.time,
      update_date : update.date,
      update_time : update.time,
    })
  }

  componentWillReceiveProps(nextProps){
    const {info, remocon_collapse} = nextProps
    const {register_date} = info
    let register_date_form = this.makeDateForm(register_date)
    let update_date_form = this.makeDateForm('now')
    if(this.state.edit_switch){
      this.setState({
        edit_switch : false,
        register_date : register_date_form.date,
        update_date : update_date_form.date,
      })
    }else{
      this.setState({
        collapse : remocon_collapse,
        register_date : register_date_form.date,
        update_date : update_date_form.date,
      })
    }
    
  }

  makeDateForm=(e)=>{
    let day = null
    let day_month = null
    let day_date = null
    if(e==='now'){
      day = new Date()
      day_month = day.getUTCMonth()+1
      day_date = day.getDate()
    }else{
      day = new Date(e)
      day_month = day.getUTCMonth()+1
      day_date = day.getUTCDate()
    }
    if(day_month<10){
      day_month = '0'+day_month
    }
    if(day_date<10){
      day_date = '0'+day_date
    }
    let date = day.getUTCFullYear()+'.'+day_month+'.'+day_date
    let time = null
    let second = null
    if(e==='now'){
      time = day.getHours()+':'+day.getMinutes()
      second = day.getSeconds()
    }else{
      time = day.getUTCHours()+':'+day.getUTCMinutes()
      second = day.getUTCSeconds()
    }
    return {
      date : date,
      time : time,
      second : second,
    }
  }
  
  handleChange=(e)=>{
    if(e.target.name==="content"){
      if(e.target.value.length<=this.state.content_max){
        this.setState({
          content : e.target.value,
          content_length : e.target.value.length
        })
      }else{
        this.setState({
          content : this.state.content,
        })
      }
    }else{
      this.setState({
        [e.target.name] : e.target.value
      })
    }
    
  }

  handleUpdate=(e)=>{
    e.preventDefault()
    const {info} = this.props
    const {title, content,no,register_date,edit,credential} = this.state
    let now_date = this.makeDateForm('now')
    let now_date_form = now_date.date+' '+now_date.time+':'+now_date.second
    let register_date_form = this.makeDateForm(register_date)
    if(localStorage.getItem('credential')!==null){
      if(edit){
        axios({
          method : 'post',
          url : this.server_url+'/board/update',
          params : {
            credential : credential,
            title : title,
            content : content,
            update_date : now_date_form,        
            no : no,
          },
        }).then((res)=>{
          if(res.data!=='err'){
            this.setState({
              content_length : info.content.length,
              edit : !this.state.edit,
              update_date : now_date.date,
              update_time : now_date.time,
              register_date : register_date_form.date,
              edit_switch : true
            })
            this.props.onUpdate(this.state)
          }else{
            localStorage.removeItem("name")
            localStorage.removeItem("credential")
            localStorage.removeItem("profile_image")
            window.location = '/'
          }
        })
      }else{
        this.setState({
          edit : !edit
        })
      }
    }else{
      swal.fire({
        title : this.not_login_update_message,
        type : "warning"
      })
    }
  }

  handleRemove=(e)=>{
    e.preventDefault()
    const {credential, no} = this.state
    if(localStorage.getItem('credential')!==null){
      swal.fire({
        title: '정말로 삭제하시겠습니까?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText : '아니요',
        confirmButtonText: '네'
      }).then((result) => {
        if (result.value) {
          swal.fire({
            title : this.confirm_remove_mewssage,
            type : "success"
          }).then(()=>{
            axios({
              method : 'post',
              url : this.server_url+'/board/remove/',
              params : {
                no : no,
                credential : credential,
              }
            }).then((res)=>{
              if(res.data!=='err'){
                this.props.onRemove(this.props.info.no)
              }else{
                localStorage.removeItem("name")
                localStorage.removeItem("credential")
                localStorage.removeItem("profile_image")
                window.location = '/'
              }
            })
          })
        }
      })
    }else{
      swal.fire({
        title : this.not_login_remove_message,
        type : "warning"
      })
    }
  }

  toggle(e) {
    this.setState({ 
        collapse: !this.state.collapse,
        edit_switch : true,
    });
  }
  

  render() {
    const {info} = this.props
    const {edit, title,title_max, content, content_length, 
      collapse, register_time, register_date, update_date, update_time} = this.state

    return (
      <Fragment>
        <Margin up/>
        <div className="card bg-light mb-3">
          <CardHeader onClick={this.toggle} className="card-header">
          <TitleSpan size={collapse?('14px'):('15px')}>{collapse? ('최근 수정 날짜 : '+update_date+' ') : (info.title)}</TitleSpan>
          <TitleDateSpan>{collapse?(update_time):('')}</TitleDateSpan>
            <CardDate time>{register_time}</CardDate>
            <CardDate>{register_date}</CardDate>
          </CardHeader>
          <rs.Collapse isOpen={collapse}>
          <div className="card-body">
            {edit?(
              <Fragment>
                <rs.Input
                  name="title" 
                  value={title} 
                  onChange={this.handleChange} 
                  maxLength={title_max} 
                  placeholder="Title..." />
                <Margin up/>
                <rs.Input type="textarea" 
                  name="content"
                  rows="7"
                  value={content}
                  onChange={this.handleChange}
                  placeholder="Comment..." 
                />
                <Float right>{content_length}/120</Float>
              </Fragment>
            ) : (
              <Fragment>
                <Title className="card-title">{info.title}</Title>
                <p className="card-text">{info.content}</p>
              </Fragment>
            )}
            <EditButton margin={edit?('10px'):('0px')} type="button" className="btn btn-success" onClick={this.handleUpdate}>{edit?("완료"):("수정")}</EditButton>
            <DeleteButton display={edit?('none'):('block')} type="button" className="btn btn-danger" onClick={this.handleRemove}>삭제</DeleteButton>
          </div>
          </rs.Collapse>
        </div>
      </Fragment>
    );
  }
}

const TitleDateSpan = styled.span`
  font-size: 12px;
  color: gray;
`

const TitleSpan = styled.span`
  font-size: ${dis=>dis.size};
  color: #212529;
`

const EditButton = styled.button`
  margin-top : ${dis=>dis.margin};
`

const DeleteButton = styled.button`
  display : ${dis=>dis.display}!important;
  float : right;
`

const CardHeader = styled.div`
  cursor: pointer;
`

const CardDate = styled.span`
  float: right;
  ${props=> props.time &&
  css`
  margin: 3px 0px 0px 10px;
  font-size: 12px;
  color: gray;
`}
`
const Title = styled.h5`
  font-weight: bold;
`



const Margin = styled.div`
  margin : 10px 10px 10px 10px;
  ${props => props.up &&
    css`
    margin : 10px 0px 0px 0px;
    `};
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

export default BoardInfo;