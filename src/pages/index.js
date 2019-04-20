import React, { Component } from 'react';
import Navbar from '../js/body/Navbar'
import Main from '../js/body/Main';
import Footer from '../js/body/Footer'

import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';


class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footer : 0,
      is_ren : false,
    }
  }

  componentDidMount(){
    document.title = "MeMo"
    this.setState({
      is_ren : true
    })
  }

  footer=(e)=>{
    this.setState({
      footer : e
    })
  }
  
  render() {
    const {footer, is_ren} = this.state
    return (
      <IndexRender ren={is_ren}>
        <MainController>
          <Navbar/>
          <Header></Header>
          <Main footer={footer}/>
          <Footer onChange={this.footer}></Footer>
        </MainController>
      </IndexRender>
    );
  }
}

const IndexRender = styled.div`
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

const MainController = styled.div`
  background-color:#ced4da;
`
export default MainPage;