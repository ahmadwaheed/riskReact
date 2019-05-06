import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

class RecentUploadUser extends React.Component {
  componentDidMount = () => {
    if (document.getElementById('cbseMetroRecentTable')) {
      document.getElementById('cbseMetroRecentTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('cbseMetroRecentTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('cbseMetroList').style.transform = translate;
  };

  //this method is used to close the current window
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
          <Scrollbars className="scrollStyle" id="cbseMetroRecentTable" style={{ maxHeight: '50vh' }}>
            <table className="table">
              <thead id="cbseMetroList" style={{ ...thead }}>
                <tr>
                  <th>Cbsa</th>
                  <th>Metro Name</th>
                  <th className="text-right">Year</th>
                  <th className="text-right">Qtr</th>
                  <th className="text-right"> Index_sa</th>
                  <th className="text-right"> Index_nsa</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.data.map((info, index) => (
                  <tr key={index}>
                    <td>{info.cbsa}</td>
                    <td>{info.metro_name}</td>
                    <td className="text-right">{info.year}</td>
                    <td className="text-right">{info.qtr}</td>
                    <td className="text-right">{info.index_sa}</td>
                    <td className="text-right">{info.index_nsa}</td>
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

RecentUploadUser.defaultProps = {
  closeWindow: undefined
};

RecentUploadUser.propTypes = {
  closeWindow: PropTypes.func
};
const mapStateToProps = state => {
  return {
    ctr: state.hpi.counter,
    auth: state.hpi.authData,
    data: state.metro.recentDataMetro
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
)(RecentUploadUser);
