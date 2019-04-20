import React, { Component } from 'react';
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from '../js/body/Navbar'
import Err from '../js/body/Err'

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_render : false
    }
  }
  
  componentDidMount(){
    document.title = "MeMo Err 404s"
    this.setState({
      is_render : true
    })
  }
  render() {
    const {is_render} = this.state
    return (
      <NotFoundRender ren={is_render}>
        <MainController>
          <Navbar/>
          <Err/>
        </MainController>
      </NotFoundRender>
    );
  }
}

const NotFoundRender = styled.div`
  display : ${dis => {
    if(dis.ren){
      return "block;"
    }else{
      return "none;"
    }
  }}
`

const MainController = styled.div`
  background-color:#ced4da
  position: fixed;
  height: 100%;
  width : 100%;
`

export default NotFoundPage;