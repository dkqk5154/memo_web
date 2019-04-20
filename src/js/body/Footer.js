import React, { Component } from 'react';
import styled from 'styled-components'

class Footer extends Component {
  constructor(props) {
    super(props);
    this.footer = null
  }

  componentDidMount(){
    this.props.onChange(this.footer)
  }

  handleScroll=(e)=>{
    this.props.onChange(this.footer)
  }
    


  render() {
      return (
          <FooterBody ref={ref=>{this.footer=ref}}>
          </FooterBody>
      );
  }
}

export default Footer;

const FooterBody = styled.div`
  width: 100%;
  height: 350px;
  margin-top : 50px;
  background-color : #495057;
`
