import React, { Component } from 'react';
import Loader from 'react-loader';

class Loaders extends Component {
  render() {
    const { loader_Wrapper } = styles;
    const { myview } = this.props;

    return (
      <div style={{ ...loader_Wrapper }} id="loader">
        <Loader loaded={myview} />
      </div>
    );
  }
}

export default Loaders;
var styles = {
  loader_Wrapper: {
    textAlign: 'center',
    color: '#000'
  }
};
