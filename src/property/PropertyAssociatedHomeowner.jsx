import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import SearchMortgage from '../SearchMortgageList';
import { unAssociate } from '../actions/borrower/borrower-action';
import Modal from 'react-responsive-modal';
import Loder from '../Loder/Loders';
import { getAssociatedHomeowner } from '../actions/admin/admin-action';
let hashCode = '';

class PropertyAssociatedHomeowner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      associateList: [],
      searchText: '',
      isDisassociateModal: false,
      userToDisassociate: {},
      isLoading: false
    };
  }

  componentDidMount = () => {
    let hashcode = this.props.match.params.hashcode;
    hashCode = hashcode;
    this.getHomeowner();
  };

  handleSubmitSearch = value => {
    let filterList = [];

    if (value && value.length > 0) {
      filterList = this.props.associateHomeowner.filter(
        x =>
          x.email.toLowerCase().includes(value) ||
          x.first_name.toLowerCase().includes(value) ||
          x.id.includes(value) ||
          x.last_name.toLowerCase().includes(value)
      );

      this.setState({
        associateList: filterList
      });
    } else {
      this.setState({
        associateList: this.props.associateHomeowner,
        searchText: ''
      });
    }
  };

  resetInput = () => {
    this.setState({
      associateList: this.props.associateHomeowner,
      searchText: ''
    });
  };

  handleChangeSeach = value => {
    this.setState({
      searchText: value,
      clearText: false
    });
    let filterList = [];

    if (value && value.length > 0) {
      filterList = this.props.associateHomeowner.filter(
        x =>
          x.email.toLowerCase().includes(value) ||
          x.first_name.toLowerCase().includes(value) ||
          x.id.includes(value) ||
          x.last_name.toLowerCase().includes(value)
      );

      this.setState({
        associateList: filterList
      });
    } else {
      this.setState({
        associateList: this.props.associateHomeowner
      });
    }
  };

  closeDisassociateModal = () => {
    this.setState({
      isDisassociateModal: false,
      userToDisassociate: {}
    });
  };

  openDisassociateModal = data => {
    this.setState({
      isDisassociateModal: true,
      userToDisassociate: data
    });
  };

  unAssociate = data => {
    this.setState({
      isLoading: false
    });

    unAssociate(this.props.userData.token, data).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.getHomeowner();

        this.setState({
          isLoading: true
        });
        this.closeDisassociateModal();
      } else {
        this.setState({
          isLoading: true
        });
      }
    });
  };

  getHomeowner = () => {
    let id = this.props.match.params.id;

    getAssociatedHomeowner(this.props.userData.token, id).then(responses => {
      if (responses && responses.request && responses && responses.request.status === 401) {
        this.props.history.push('/login');
      } else if (responses) {
        this.setState({
          isLoading: true,
          associateList: responses
        });
      } else {
        this.setState({
          isLoading: true
        });
      }
    });
  };

  render() {
    const { thead } = styles;

    if (this.state.isLoading) {
      return (
        <div
          className="col-xs-12 margin-bottom nopad pad-up pad-down"
          style={{
            border: '1px solid #ddd',
            marginTop: '60px',
            background: '#fff'
          }}
        >
          {hashCode && hashCode !== '' ? (
            <h4 className="col-xs-12 col-md-6">Homeowners associated with this property : </h4>
          ) : (
            <h4 className="col-xs-12 col-md-6 pad-down px-2">Users who can view this property : </h4>
          )}
          {hashCode && hashCode !== '' ? (
            <div className="col-md-4 pull-right">
              {' '}
              <SearchMortgage
                handleSubmit={this.handleSubmitSearch}
                clearText={this.state.clearText}
                handleReset={this.resetInput}
                handleOnchange={this.handleChangeSeach}
              />
            </div>
          ) : null}
          <Scrollbars
            id="mortgageDataElement"
            className="scrollStyle"
            style={
              this.state.associateList && this.state.associateList.length > 2
                ? { maxHeight: '40vh' }
                : { maxHeight: '20vh' }
            }
          >
            <table className="table table-borderless">
              <thead id="mortgageData" style={{ ...thead }}>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.associateList &&
                  this.state.associateList.length > 0 &&
                  this.state.associateList.map((data, index) => (
                    <tr key={index}>
                      <td>{data.id}</td>
                      <td>
                        {data.first_name} {data.last_name}
                      </td>
                      <td>{data.email}</td>
                      {hashCode && hashCode !== '' ? (
                        <td className="text-right pr-20">
                          <button
                            type="button"
                            className="btn btn-orange text-left"
                            onClick={() => this.openDisassociateModal(data)}
                          >
                            Disassociate
                          </button>{' '}
                        </td>
                      ) : null}
                    </tr>
                  ))}
              </tbody>
            </table>
          </Scrollbars>
          {hashCode && hashCode !== '' ? null : (
            <p className="px-2 pad-up">
              “Need to give another user access to this property? Share with them your property’s hash code and they can
              register for access: {this.props.selectedMortgageData.property_hashcode + '"'}
            </p>
          )}
          <Modal
            open={this.state.isDisassociateModal}
            classNames={{ modal: 'custom-modal' }}
            onClose={this.closeDisassociateModal}
            center
          >
            <h2 className="modal-header">Disassociate Homeowner</h2>
            <div className="modal-body">
              <div className="row ">
                <div className="col-xs-9 pad-half" style={{ marginBottom: '25px' }}>
                  Are you sure you wish to disassociate user from this property ?
                </div>
              </div>
              <div className="row">
                <div className="col-xs-3 col-xs-offset-6">
                  <button
                    onClick={() => this.unAssociate(this.state.userToDisassociate)}
                    className="btn btn-block orange-bg btn-own"
                  >
                    Ok{' '}
                  </button>
                </div>
                <div className="col-xs-3 text-right">
                  <button onClick={() => this.closeDisassociateModal()} className="btn btn-block orange-bg btn-own">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      );
    } else {
      return <Loder myview={this.state.isLoading} />;
    }
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

PropertyAssociatedHomeowner.defaultProps = {
  associateHomeowner: [],
  selectedMortgageData: {}
};

PropertyAssociatedHomeowner.propTypes = {
  associateHomeowner: PropTypes.arrayOf(Object),
  selectedMortgageData: PropTypes.object
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData,
    associateHomeowner: state.admin.associateHomeowner,
    selectedMortgageData: state.admin.selectedMortgageData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    unAssociate: (token, data) => dispatch(unAssociate(token, data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PropertyAssociatedHomeowner));
