import React, {Fragment, Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from '../js/body/Login'

class login extends Component {
  componentDidMount(){
    document.title = "MeMo 로그인"
  }
  render() {
    return (
      <Fragment>
        <Login/>
      </Fragment>
    );
  }
}

export default login;