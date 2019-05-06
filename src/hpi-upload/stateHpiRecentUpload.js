import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

class StateRecentUpload extends React.Component {
  componentDidMount = () => {
    if (document.getElementById('stateHpiRecentTable')) {
      document.getElementById('stateHpiRecentTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('stateHpiRecentTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('stateHpiList').style.transform = translate;
  };

  close = () => {
    this.props.closeWindow();
  };

  render() {
    const { thead } = styles;

    return (
      <div className="col-xs-12 margin-bottom">
        <div className="col-xs-12 cross-wrapper white-bg">
          <i className="fa fa-times" onClick={this.close} />
        </div>

        <div className="col-xs-12 nopad table-responsive details-table white-bg">
          <Scrollbars className="scrollStyle" id="stateHpiRecentTable" style={{ maxHeight: '50vh' }}>
            <table className="table">
              <thead id="stateHpiList" style={{ ...thead }}>
                <tr>
                  <th>state</th>
                  <th className="text-right">Year</th>
                  <th className="text-right">qtr</th>
                  <th className="text-right">index_nsa</th>
                  <th className="text-right"> index_sa</th>
                  <th className="text-right"> Warning</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.data.map((info, index) => (
                  <tr key={index}>
                    <td>{info.state}</td>
                    <td className="text-right">{info.year}</td>
                    <td className="text-right">{info.qtr}</td>
                    <td className="text-right">{info.index_nsa}</td>
                    <td className="text-right">{info.index_sa}</td>
                    <td className="text-right">{info.warning}</td>
                    <td className="text-right" />
                  </tr>
                ))}
              </tbody>
            </table>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

StateRecentUpload.defaultProps = {
  closeWindow: undefined
};

StateRecentUpload.propTypes = {
  closeWindow: PropTypes.func
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    ctr: state.hpi.counter,
    auth: state.hpi.authData,
    data: state.stateReducer.recentDataState
  };
};

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};
export default connect(
  mapStateToProps,
  null
)(StateRecentUpload);
