import React, {Fragment, Component } from 'react';
import styled from 'styled-components'


class Err extends Component {
  render() {
    return (
      <Fragment>
        <Controller>
          <Img src={require('../../img/error-404.png')}/>
          <Text>찾을수 없는 페이지에요!</Text>
        </Controller>
      </Fragment>
    );
  }
}

const Controller = styled.div`
  width: 800px;
  margin: 0 auto;
  margin-top: 110px;
  position: relative;
  padding: 100px 100px 100px 100px;
  background-color : white;
`

const Img = styled.img`
  width : 220px;
  height : 220px;
  margin : 0 auto;
  display: block;
`

const Text = styled.p`
  margin : 0 auto;
  margin-top : 10px;
  font-size: 50px;
  text-align: center;
`


export default Err;