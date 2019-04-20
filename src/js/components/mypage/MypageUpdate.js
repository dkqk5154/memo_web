import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import axios from 'axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert2';
import ServerInfo from '../../info/ServerInfo'


class MypageUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credential : this.props.credential,
      write_board_count : this.props.write_board_count,
      display : this.props.display,
      profile_image : this.props.profile_image,
      profile_temp_file : null,
      profile_temp_name : '',
      profile_temp_path : '',
      upload_default_button_img : require('../../../img/image_upload_button.png'),
      is_profile_temp : false,
      is_name_change : false,
      name :{
        alarm : '',
        color : "red",
        value : this.props.name,
      },
      modal : false,
      overlap_names : ['arr'],
    }
    this.overlap_name_err="중복된 닉네임입니다!"
    this.handleModalToggle = this.handleModalToggle.bind(this);
  }

  componentWillReceiveProps(nextProps){
    const {name} = this.state
    this.setState({
      ...nextProps,
      name : {
        ...name,
        value : nextProps.name
      }
    })
  }

  hanldeNameChange=(e)=>{
    const namePattern = /^[가-힣|a-z|A-Z|0-9|]+$/ 
    const {overlap_names} = this.state
    const et = e.target
    if(et.name==='name'){
      if(namePattern.exec(et.value)){
        if(et.value.length<=8){
          if(overlap_names.some(val=>val===et.value)){
            this.setState({
              name: ({ 
                alarm : this.overlap_name_err,
                color : "red",
                value : et.value,
              }),
            })
          }else{
            this.setState({
              name: ({ 
                alarm : "좋은 닉네임 입니다!",
                color : "green",
                value : et.value,
              }),
            })
          }
        }else{
          this.setState({
            name: ({
              alarm : "닉네임은 8자 이하로 해주세요!",
              color : "red",
              value : et.value,
            })
          })
        }
      }else{
        if(et.value.length===0){
          this.setState({
            name: ({ 
              alarm : "",
              color : "red",
              value : et.value,
            }),
          })
        }else{
          this.setState({
            name: ({ 
              alarm : "글자기호, 특수기호 사용불가 입니다!",
              color : "red",
              value : et.value,
            }),
          })
        }
      }
    }
  }

  handleNameUpdate=()=>{
    const {is_name_change,name} = this.state
    if(is_name_change){
      if(name.value===''){
        this.setState({
          is_name_change : !is_name_change,
          name : {
            ...name,
            value : this.props.name
          }
        })
      }
      else if(name.value===this.props.name){
        this.setState({
          is_name_change : !is_name_change
        })
      }else if (name.color==='red'){
        this.nameUpdateRed()
      }else if (name.color==='green'){
        this.nameUpdateGreen()
      }
    }else{
      this.setState({
        is_name_change : !is_name_change
      })
    }
  }

  nameUpdateGreen=()=>{
    const {name,credential} = this.state
    swal.fire({
      title: "이름을 변경 하시겠습니까?",
      text: "닉네임 변경은 언제든지 가능합니다!",
      type: "warning",
      showCancelButton: true,
      cancelButtonText : '아니오',
      confirmButtonColor: '#3085d6',
      confirmButtonText: '네'
    })
    .then((is_true) => {
      if(is_true.value){
        axios({
          method:'post',
          url: ServerInfo().location+'/mypage/update/name',
          params: {
            name : name.value,
            credential : credential,
          }
        }).then(res=>{
          if(res.data!=='err'){
            localStorage.setItem('name',name.value)
            swal.fire({
              title : "이름을 변경했어요!",
              type: "success",
            }).then(()=>{
              window.location = '/mypage'
            })  
          }else{
            localStorage.removeItem("name")
            localStorage.removeItem("credential")
            localStorage.removeItem("profile_image")
            window.location = '/'
          }
        })
      }
    })
  }

  nameUpdateRed=()=>{
    const {name} = this.state
    swal.fire({
      title: name.alarm,
      type: "warning",
    })
  }

  handleProfileUpdate=(e)=>{
    e.preventDefault()
    const {profile_temp_file,credential} = this.state
    const formData = new FormData()
    if(profile_temp_file===null){
      swal.fire({
        title : "먼저 이미지를 등록해주세요!", 
        type: "warning",
      })
    }else{
      swal.fire({
        title: '업로드 하시겠습니까?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText : '아니요',
        confirmButtonText: '네'
      }).then((result)=>{
        if(result.value){
          formData.append('file',profile_temp_file)
          formData.append('credential',credential)
          axios({
            method:'post',
            url: ServerInfo().location+'/mypage/update/profile',
            data : formData,
            params : {credential : credential},
            config: { headers: {'Content-Type': 'multipart/form-data' }}
          }).then(res => {
            const {status, profile_image} = res.data
            if(status){
              localStorage.setItem('profile_image',profile_image)
            }else{
              swal.fire({
                title : '오류! 다시 업로드 해주세요!',
                type : 'error'
              })
            }
          }).catch(err => {
            console.error(err); 
          })
          swal.fire({
            title :"이미지를 변경했어요!", 
            type: "success",
          }).then(()=>{
            window.location = '/mypage'
          })
        }
      });
    }
  }

  handleProfileChange=(e)=>{
    if(e.target.files[0]!==undefined){
      if(e.target.files[0].type!=='image/jpeg' && e.target.files[0].type!=='image/png'){
        alert("이미지 파일만 올려주세요!")
      }else{
        let reader = new FileReader();
        let file = e.target.files[0]
        reader.onloadend = () => {
          this.setState({
            profile_temp_file : file,
            profile_temp_name : file.name,
            is_profile_temp : true,
            profile_temp_path: reader.result
          });
        }
        reader.readAsDataURL(file)
      }
    }
  }

  handleModalToggle=()=>{
    this.setState({
      modal : !this.state.modal,
      is_profile_temp : false
    })
  }

  render() {
    const {display,name,is_name_change, profile_temp_name,profile_image,
      is_profile_temp, upload_default_button_img,profile_temp_path,write_board_count} = this.state
    return (
      <Fragment>
        <MypageUpadateController display={display}>
          <MypageUpdateForm>
            <ProfileController>
              <ProfileImg src={profile_image}/>
              <ProfileConfirmButton onClick={this.handleModalToggle} className="btn btn-success">변경</ProfileConfirmButton>
              </ProfileController>
            <StateController>
              {is_name_change?(
              <div>
                <StateNameInput type="text" className="form-control" 
                name="name" onChange={this.hanldeNameChange} value={name.value}/>
                <StateNameAlarm color={name.color}>{name.alarm}</StateNameAlarm>
              </div>
              ):
              (<StateName>{name.value}</StateName>)}
              <StateMemo>작성한 메모수 : {write_board_count}</StateMemo>
            </StateController>
            <NameUpdateButtonController>
              <NameUpdateButton onClick={this.handleNameUpdate} 
              className="btn btn-primary">{is_name_change?('확인'):('변경')}</NameUpdateButton>
            </NameUpdateButtonController>
          </MypageUpdateForm>
        </MypageUpadateController>
        <Modal isOpen={this.state.modal} toggle={this.handleModalToggle} className={this.props.className}>
        <ModalHeader toggle={this.handleModalToggle}>
        <ModalHeaderText>이미지 업로드</ModalHeaderText>
        </ModalHeader>
          <ModalBody >
            <ModalImageUploadForm>
                <ModalImageUploader>
                    <ModalImgageUploaderButton src={is_profile_temp?(profile_temp_path):(upload_default_button_img)}/>
                  <ModalImageUploadInput accept="image/*" onChange={this.handleProfileChange} type="file"/>
                  <ModalImageUploaderText>{is_profile_temp?(profile_temp_name):("사진을 넣어주세요!")}</ModalImageUploaderText>
                </ModalImageUploader>
            </ModalImageUploadForm>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleProfileUpdate}>업로드</Button>
            <Button color="secondary" onClick={this.handleModalToggle}>취소</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

const ModalImageUploadForm = styled.div`
  margin : 0 auto;
  border 3px dashed #4f9af5;
  height : 300px;
  width: 470px;
`

const ModalImageUploader = styled.div`
  margin: 0 auto;
  margin-top: 7%;
  width: 300px;
  height: 200px;
`

const ModalImgageUploaderButton = styled.img`
  width: 180px;
  height: 180px;
  display: block;
  margin: 0 auto;
`

const ModalImageUploadInput = styled.input`
  font-size: 29px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 100%;
  opacity : 0;
`

const ModalImageUploaderText = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10%;
`

const ModalHeaderText = styled.span`
  font-weight : bold;
`



const MypageUpadateController = styled.div`
  border-radius: 12px;
  background-color: white;
  display: ${dis=>dis.display};
  width: 820px;
  margin: 0 auto;
  height: 370px;
`

const MypageUpdateForm = styled.div`
  width: 100%;
  height: 90%;
  margin: 20px 30px;
  position: absolute;
`

const ProfileController = styled.div`
  display : inline-block;
  margin-left: 10px;
  position : absolute;
  width : 30%;
  height : 100%;
`

const StateController = styled.div`
  display : inline-block;
  position : absolute;
  margin-left : 280px;
  width: 320px;
  height : 100%;
`

const NameUpdateButtonController = styled.div`
  display: inline-block;
  position : absolute;
  margin-left : 600px;
  width : 20%;
  height : 100%;
`

const ProfileImg = styled.img`
  display : block;
  width: 250px;
  height: 250px;
  border-radius : 180px;
`

const ProfileConfirmButton = styled.button`
  margin: 0 auto;
  margin-top : 15px;
  display: block !important;
  width: 100px;
  margin-left: 75px;
`

const StateName = styled.p`
  margin-top: 60px;
  text-align: center;
  font-weight: bold;
  font-size: 32px;
  font-weight: bold;
`

const StateNameInput = styled.input`
  margin-top: 68px;
  margin-left: 80px;
  width: 200px !important;
  border-color: #6c757dab !important;
`

const StateNameAlarm = styled.p`
  color : ${dis=>dis.color};
  width: 100%;
  margin-top : 10px;
  margin-left : 80px;
`

const StateMemo = styled.p`
  text-align: center;
  font-size : 18px;
  font-weight : bold;
  margin-top: 120px;
`

const NameUpdateButton = styled.button`
  margin-top: 67px;
`


export default MypageUpdate;