import React, { Component, Fragment } from 'react';
import styled, {} from 'styled-components';

class BoardRemocon extends Component {

  state = {
    collapse : false,
    win_width : 0
  }
  remocon = null
  

  handleClick=(e)=>{
    if(e.target.value==="all"){
      this.setState({
        collapse : !this.state.collapse
      })
    }
    this.props.onClick(e.target.value)
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleScroll);
    this.setState({
      win_width : window.innerWidth
    })
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.handleScroll)
  }

  handleScroll=()=>{
    this.setState({
      win_width : window.innerWidth
    })
  }


  render() {
    const {collapse,win_width} = this.state
    const {nav} = this.props
    return (
      <Fragment>
        <Remocon ref={ref=>{this.remocon=ref}} win_width={win_width} nav={nav}>
          <Header className="card-header">
            리모컨
          </Header>
          <Body className="card-body">
          <Button onClick={this.handleClick} value="up" >맨 위로</Button>
          <Button onClick={this.handleClick} value="all" >{collapse?("펼치기"):("접기")}</Button>
          <Button onClick={this.handleClick} value="down">맨 아래로</Button>
          </Body>
        </Remocon>
      </Fragment>
    );
  }
}

const Remocon = styled.div `
  position: fixed;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
  right : 50px;
  top : 300px;
  display : ${dis=>{
    if(dis.win_width<1280 || dis.nav){
      return "none;"
    }else{
      return "block;"
    }
  }}
`

const Body = styled.div`
  width : 100%;
`
const Header = styled.div`
  text-align: center;
`
const Button = styled.button`
  display : block;
  margin: 0 auto;
  margin-bottom: 5px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
`

export default BoardRemocon;