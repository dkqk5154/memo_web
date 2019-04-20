import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from '../js/body/Navbar'
import styled from 'styled-components'
import Mypage from '../js/body/Mypage';
import Footer from '../js/body/Footer';


class mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      is_render : false,
    }
  }

  componentDidMount(){
    document.title = "MeMo 마이페이지"
    this.setState({
      is_render : true,
    })
  }

  footerChange=()=>{

  }


  render() {
    const {is_render} = this.state
    return (
      <MypageRender ren={is_render}>
        <MainController>
          <Navbar/>
          <Header></Header>
          <Mypage/>
          <Empty></Empty>
          <Footer onChange={this.footerChange}></Footer>
        </MainController>
      </MypageRender>
    );
  }
}

const MypageRender = styled.div`
  display : ${dis => {
    if(dis.ren){
      return "block;"
    }else{
      return "none;"
    }
  }}
`

const Header=styled.div`
  width: 100%;
  height: 100px;
`

const Empty = styled.div`
  width : 100%;
  height : 100px;
`
  
const MainController = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-position: 50% 50%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: "";
  z-index: 1;
  background-color:#ced4da
`
export default mypage;