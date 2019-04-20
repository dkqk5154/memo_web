import React, { Component } from 'react';
import * as rs from 'reactstrap';
import styled from 'styled-components'

class BoardSearchForm extends Component {
  toggleDropDown = this.toggleDropDown.bind(this);
  state = {
    keyword : '',
    dropdownopen : false,
    search_filter : 'title',
    input_title : '제목'
  }
 
  handleChange=(e)=>{
    const {search_filter} = this.state

    let et = e.target
      this.setState({
        [et.name] : et.value,
      })
    this.props.onChange({
      search_filter : search_filter,
      keyword : et.value,
    }) 
  }

  handleClick=(e)=>{
    const {keyword} = this.state
    let et = e.target
    if(et.id==='title'){
      this.setState({
        [et.name] : et.id,
        input_title : '제목',
      })
    }else if(et.id==='content'){
      this.setState({
        [et.name] : et.id,
        input_title : '내용'
      })
    }
    this.props.onChange({
      search_filter : et.id,
      keyword : keyword
    }) 
  }
  
  toggleDropDown() {
    this.setState({
      dropdownopen: !this.state.dropdownopen
    });
  }

  render() {
    const {input_title, dropdownopen, keyword} = this.state
    return (
      <Controller>
        <rs.InputGroup>
          <rs.InputGroupButtonDropdown 
            addonType="append"
            isOpen={dropdownopen} 
            toggle={this.toggleDropDown}>
          <rs.DropdownToggle value="Empty" caret>
          {input_title}
          </rs.DropdownToggle>
          <rs.DropdownMenu>
            <rs.DropdownItem onClick={this.handleClick} name="search_filter" id="title">제목</rs.DropdownItem>
            <rs.DropdownItem onClick={this.handleClick} name="search_filter" id="content">내용</rs.DropdownItem>
          </rs.DropdownMenu>
        </rs.InputGroupButtonDropdown>
        <rs.Input
          value={keyword}
          name="keyword"
          onChange={this.handleChange}
        />
        </rs.InputGroup>
      </Controller>
    );
  }
}

const Controller = styled.div`
  margin-bottom : 10px;
`

export default BoardSearchForm;