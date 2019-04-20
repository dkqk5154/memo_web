import React, { Component } from 'react';
import BoardInfo from './BoardInfo';

class BoardInfoList extends Component {
  static defaultProps={
    data : []
  }

  render() {
    const {data, onUpdate,onRemove, remocon_collapse} = this.props
    const list = data.map(
      info => <BoardInfo
        info={info}
        key={info.no}
        remocon_collapse={remocon_collapse}
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    )


    return (
      <div>
        {list}
      </div>
    );
  }
}

export default BoardInfoList;