import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
let hashCode = '';
class PropertyPoolHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      poolHistoryStateData: this.props.poolHistoryStateData
    };
  }

  componentDidMount = () => {
    let hashcode = this.props.match.params.hashcode;
    hashCode = hashcode;
  };

  render() {
    const { thead } = styles;

    return (
      <div className="col-xs-12 margin-bottom nopad pad-up bg-white">
        <h4 className="col-xs-12 col-md-6 pad-up-down px-2">Pool History : </h4>
        <Scrollbars
          id="mortgageDataElement"
          className="scrollStyle"
          style={
            this.props.poolHistoryStateData && this.props.poolHistoryStateData.length > 2
              ? { maxHeight: '30vh' }
              : { maxHeight: '15vh' }
          }
        >
          <table className="table table-borderless">
            <thead id="mortgageData" style={{ ...thead }}>
              <tr>
                <th>Pool Name</th>
                <th>Entry Date</th>
                <th>Exit Date</th>
                <th>{hashCode && hashCode !== '' ? 'Diversified Notional Price' : 'Diversified Home Value'}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.poolHistoryStateData && this.props.poolHistoryStateData.length > 0 ? (
                this.props.poolHistoryStateData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.pool_name}</td>
                    <td>{data.entry_date ? moment(data.entry_date).format('MM/DD/YYYY') : data.entry_date}</td>
                    <td>{data.exit_date ? moment(data.exit_date).format('MM/DD/YYYY') : data.exit_date}</td>
                    <td>{data.diverse_notional_price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>This Property is not linked to any pool yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Scrollbars>
      </div>
    );
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

PropertyPoolHistory.defaultProps = {
  poolHistoryStateData: []
};

PropertyPoolHistory.propTypes = {
  poolHistoryStateData: PropTypes.arrayOf(Object)
};

export default connect(
  null,
  null
)(withRouter(PropertyPoolHistory));
