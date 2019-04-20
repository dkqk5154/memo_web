import React, {Fragment, Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from '../js/body/Register'

class register extends Component {
  componentDidMount(){
    document.title = "MeMo 회원가입"
  }
  render() {
    return (
      <Fragment>
        <Register/>
      </Fragment>
    );
  }
}

export default register;