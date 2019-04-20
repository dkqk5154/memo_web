import React, { Component ,Fragment} from 'react';
import * as rs from 'reactstrap';
import styled, {} from 'styled-components'

class nav extends Component {
  constructor(props) {
      super(props);
      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false,
        remocon : true,
        win_width : 0,
        credential : '',
        name : '',
        profile_img : '',
        is_login : false,
        is_toggle : false,
        is_render : false,
      };
      this.login_nav = null
      this.logout_nav = null
      this.toggle_width_size = 767
    }

  handleRemocon=()=>{
    this.setState({
      remocon : !this.state.remocon
    })
    this.props.onClick(this.state)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleScroll);
    this.setState({
      name : localStorage.getItem("name"),
      credential : localStorage.getItem("credential"),
      profile_img : localStorage.getItem('profile_image'),
    })
    if(localStorage.getItem("name")!==null){
      this.logout_nav.remove()
      if(window.innerWidth<=this.toggle_width_size){
        this.setState({
          win_width : window.innerWidth,
          is_toggle : false,
          is_login : false,
          is_render : true,
        })
      }else{
        this.setState({
          win_width : window.innerWidth,
          is_toggle : true,
          is_login : true,
          is_render : true,
        })
      }
    }else{
      this.login_nav.remove()
      if(window.innerWidth<=this.toggle_width_size){
        this.setState({
          win_width : window.innerWidth,
          is_toggle : false,
          is_login : false,
          is_render : true,
        })
      }else{
        this.setState({
          win_width : window.innerWidth,
          is_toggle : true,
          is_login : false,
          is_render : true,
        })
      }
    }
  }


  handleScroll=()=>{
    if(window.innerWidth<=this.toggle_width_size){
      this.setState({
        win_width : window.innerWidth,
        is_toggle : false,
      })
    }else{
      this.setState({
        win_width : window.innerWidth,
        is_toggle : true,
      })
    }
  }

  handleLogout=(e)=>{
    e.preventDefault()
    localStorage.removeItem("name")
    localStorage.removeItem("credential")
    localStorage.removeItem("profile_image")
    window.location = '/'
  }

  render() {
    const {name, profile_img,is_toggle,is_render} = this.state
    return (
      <NavRender ren={is_render}>
        <rs.Navbar color="primary" light fixed="top" expand="md">
          <rs.NavbarBrand className="text-white" href="/">
          <BackButtonController>
            <BackButtonImg src={require('../../img/pad.png')}/>
            <BackButton>MeMo</BackButton>
          </BackButtonController>
          </rs.NavbarBrand>
          <rs.NavbarToggler onClick={this.toggle} />
          <rs.Collapse isOpen={this.state.isOpen} navbar>
            <rs.Nav className="ml-auto" navbar>
              <div ref={ref=>this.logout_nav=ref}>
              {is_toggle?(
                <Fragment>
                  <LoginButton href="/login">로그인</LoginButton>
                  <RegisterButton href="/register">회원가입</RegisterButton>
                </Fragment>
              ):(
                <Fragment>
                  <ToggleLine>
                    <ToggleBox>
                      <LoginToggleButton href="/login" >로그인</LoginToggleButton>
                    </ToggleBox>
                  </ToggleLine>
                  <ToggleLine>
                    <ToggleBox>
                      <RegisterToggleButton href="/register" >회원가입</RegisterToggleButton>
                    </ToggleBox>
                  </ToggleLine>
                </Fragment>
              )}
              </div>
              <div className="text-white" ref={ref=>this.login_nav=ref}>
                {is_toggle?(
                  <Fragment>
                  <rs.NavItem>
                    <ProfileImg src={profile_img}/>
                    <ProfileName href="/mypage">{name}님 환영합니다!</ProfileName>
                    <LogOutButton onClick={this.handleLogout}>로그아웃</LogOutButton>
                  </rs.NavItem>
                </Fragment>
                ):( 
                  <Fragment>
                    <ToggleLine>
                      <ToggleBox>
                        <ProfileToggleName href="/mypage">마이페이지</ProfileToggleName>
                      </ToggleBox>
                    </ToggleLine>
                    <ToggleLine>
                      <ToggleBox>
                        <LogOutToggleButton onClick={this.handleLogout}>로그아웃</LogOutToggleButton>
                      </ToggleBox>
                    </ToggleLine>
                  </Fragment>
                )}
              </div>
            </rs.Nav>
          </rs.Collapse>
        </rs.Navbar>
      </NavRender>
    );
  }
}

const NavRender = styled.div`
  display : ${dis => {
    if(dis.ren){
      return "block;"
    }else{
      return "none;"
    }
  }}
`
const ToggleBox = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
`

const ToggleLine = styled.li`
  border-top : 1px solid rgba(255,255,255,.15);
`

const BackButtonController = styled.div`
  position : relative;
  margin-left : 10px;
  border-radius : 8px;
`

const BackButtonImg = styled.img`
  margin-left : 7px;
  margin-bottom : 5px;
  width: 40px;
`
const BackButton = styled.span`
  font-family: 'Anton', sans-serif;
  color: white;
  position: relative;
  top: 5px;
  left: 4px;
  font-size: 30px;
  font-weight: bold;
`
const ProfileImg = styled.img`
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 7px;
  width : 40px;
  height : 40px;
  border-radius : 180px;
`
const ProfileName = styled.a`
  cursor: pointer;
  display : inline-block;
  font-size: 15px;
  margin-top : 16px;
  color : white;
  :hover {
    text-decoration : none;
    color : white;
  }
`
const ProfileToggleName = styled.a`
  display : inline-block;
  cursor: pointer;
  margin-left : 10px;
  color : white;
  font-weight: bold;
  font-size: 15px;
  :hover {
    text-decoration : none;
    color : white;
  }
` 

const LogOutToggleButton = styled.p`
  display : inline-block;
  cursor: pointer;
  margin-left : 10px;
  margin-bottom: 0px;
  color : white;
  font-weight: bold;
  font-size: 15px;
`
const LoginButton = styled.a`
  color : white;
  :hover {
    text-decoration : none;
    color : white;
}
`
const LogOutButton = styled.span`
  color : white;
  margin-left : 10px;
  cursor : pointer
`

const RegisterButton = styled.a`
  color : white;
  margin-left : 10px;
  :hover {
    text-decoration : none;
    color : white;
  }
`

const LoginToggleButton = styled.a`
  color : white;
  margin-left : 10px;
  :hover {
    text-decoration : none;
    color : white;
  }
`
const RegisterToggleButton = styled.p`
  color : white;
  margin-left : 10px;
  :hover {
    text-decoration : none;
    color : white;
  }
`

export default nav;