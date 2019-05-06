import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

class PropertyInPool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false
    };
  }

  componentDidMount = () => {
    if (document.getElementById('userDataElement')) {
      const data = JSON.parse(sessionStorage.getItem('user'));

      if (data === undefined || data === null) {
        this.props.history.push('/');
      } else {
        document.getElementById('userDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
      }
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('userDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    let scroll = document.getElementById('userData');

    if (scroll && translate) {
      scroll.style.transform = translate;
    }
  };

  goToUserReport = data => {
    this.props.goToUserReport(data);
  };

  closeUserModal = () => {
    this.props.closeUserModal();
  };

  render() {
    return (
      <Modal open={this.props.isUserModal} classNames={{ modal: 'custom-modal' }} onClose={this.closeUserModal} center>
        <h2 className="modal-header">Properties in Pool</h2>
        <div className="modal-body">
          <div className="col-xs-12 table-responsive" style={{ maxHeight: '50vh', minHeight: '25vh' }}>
            <table className="table table-borderless">
              <thead id="userData" style={{ backgroundColor: '#fff' }}>
                <tr>
                  <th className="text-center">Property Id</th>
                  {/* <th className="text-center">Homeowner Name</th> */}
                  <th className="text-center">Property Address</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.userList &&
                  this.props.userList.length > 0 &&
                  this.props.userList.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data.propertyid}</td>
                      {/* <td className="text-center">  {data.first_name}{' '}{data.last_name}</td> */}
                      <td className="text-center">
                        {data.address1}, {data.state} {data.city}
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          title="User Report"
                          className="btn-controls"
                          onClick={() => this.goToUserReport(data)}
                        >
                          <i className="fa fa-file-excel-o" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-xs-3 col-xs-offset-6" />
            <div className="col-xs-3 text-right" />
          </div>
        </div>
      </Modal>
    );
  }
}

PropertyInPool.defaultProps = {
  userData: {}
};

PropertyInPool.propTypes = {
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(withRouter(PropertyInPool));
