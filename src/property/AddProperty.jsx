import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { clearSelectedMortgageData, saveSelectedMortgageData, addPropertyData } from '../actions/admin/admin-action';
import { Scrollbars } from 'react-custom-scrollbars';
import NavigationTab from '../home/NavigationTab';
import { error } from '../actions/login/loginAction';
import Loader from '../Loder/Loders';
import MessageNotification from '../MessageNotification';

class AddProperty extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      isEdit: false,
      isLoader: true,
      mortgageData: {
        postalcode: '',
        address1: '',
        city: '',
        state: '',
        scountyname: '',
        scountycode: '',
        lat: '',
        long: '',
        icensusyear: '',
        type: '',
        firstMortgageAmount: '320000'
      },
      errors: {},
      isError: true
    };
    this.updatedMortgageData = {};
  }

  componentDidMount = () => {
    const dataHeader = JSON.parse(sessionStorage.getItem('user'));

    if (dataHeader === undefined || dataHeader === null) {
      this.props.history.push('/');
    } else {
      this.setState({
        userData: dataHeader
      });
      if (document.getElementById('mortgageDataElement')) {
        document.getElementById('mortgageDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
      }
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('mortgageData').style.transform = translate;
  };

  handleValidation() {
    let fields = Object.assign({}, this.state.mortgageData);
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields['long']) {
      formIsValid = false;
      errors['long'] = 'Cannot be empty';
    }

    if (!fields['icensusyear']) {
      formIsValid = false;
      errors['icensusyear'] = 'Cannot be empty';
    }

    if (!fields['lat']) {
      formIsValid = false;
      errors['lat'] = 'Cannot be empty';
    }

    if (!fields['scountycode']) {
      formIsValid = false;
      errors['scountycode'] = 'Cannot be empty';
    }

    if (!fields['scountyname']) {
      formIsValid = false;
      errors['scountyname'] = 'Cannot be empty';
    }

    if (!fields['state']) {
      formIsValid = false;
      errors['state'] = 'Cannot be empty';
    }

    if (!fields['city']) {
      formIsValid = false;
      errors['city'] = 'Cannot be empty';
    }

    if (!fields['postalcode']) {
      formIsValid = false;
      errors['postalcode'] = 'Cannot be empty';
    }

    if (!fields['address1']) {
      formIsValid = false;
      errors['address1'] = 'Cannot be empty';
    }

    if (!fields['firstMortgageAmount']) {
      formIsValid = false;
      errors['firstMortgageAmount'] = 'Cannot be empty';
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleMortgageChange = (event, name) => {
    const target = event.target;
    const value = target.value;
    this.updatedMortgageData[name] = value;
    let mortgageData = Object.assign({}, this.state.mortgageData);
    mortgageData[name] = value;
    mortgageData['type'] = 'individual';

    this.setState({
      mortgageData: mortgageData
    });
  };

  handleChange = address => {
    let mortgageData = Object.assign({}, this.state.mortgageData);
    mortgageData['address1'] = address;
    this.setState({ mortgageData: mortgageData });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        getLatLng(results[0]).then(res => {
          let fields = Object.assign({}, this.state.mortgageData);
          fields['lat'] = res.lat;
          fields['long'] = res.lng;
          fields['address1'] = address;
          fields['type'] = 'Google Service';

          this.setState({
            mortgageData: fields
          });
        });
      })
      .catch(error => error(error));
  };

  submitMortgageData = event => {
    this.setState({
      isLoader: false
    });
    event.preventDefault();
    if (this.handleValidation()) {
      this.setState({
        isError: false
      });

      addPropertyData(this.props.userData.token, this.state.mortgageData).then(res => {
        if (res && res.request && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res && res.property_hashcode) {
          console.log('Hash Code', res.property_hashcode);

          this.setState({
            isLoader: true
          });
          this.props.history.push('/properties-list');
        } else if (res) {
          this.setState({
            isLoader: true
          });
        }
      });
    } else {
      this.setState({
        isError: true,
        isLoader: true
      });
    }
  };

  cancelMortgageUpdation = () => {
    let mortgageData = Object.assign({}, this.state.mortgageData);
    mortgageData['postalcode'] = '';
    mortgageData['address1'] = '';
    mortgageData['city'] = '';
    mortgageData['state'] = '';
    mortgageData['scountyname'] = '';
    mortgageData['scountycode'] = '';
    mortgageData['lat'] = '';
    mortgageData['long'] = '';
    mortgageData['icensusyear'] = '';
    mortgageData['type'] = '';
    mortgageData['firstMortgageAmount'] = '320000';

    this.setState({
      mortgageData: mortgageData
    });
  };

  backToList = history => {
    history.goBack();
  };

  render() {
    return (
      <div>
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationTab isMorgageList="true" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 mortgage-form">
          <span className="back-arrow shadow-arrow" onClick={() => this.backToList(this.props.history)}>
            <img src="img/back-arrow.png" alt="back-arrow" />
          </span>
          <form onSubmit={e => this.submitMortgageData(e)}>
            <Scrollbars className="scrollStyle" style={{ maxHeight: '60vh' }}>
              <div className="col-xs-12 nopad">
                <div className="form-group col-xs-6 col-sm-3">
                  {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                  <label>Property Address</label>
                  <PlacesAutocomplete
                    value={this.state.mortgageData.address1}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div className="relative">
                        <input
                          className="form-control"
                          {...getInputProps({
                            placeholder: 'Search Places ...',
                            className: 'location-search-input form-control'
                          })}
                        />
                        {suggestions.length > 0 ? (
                          <div className="autocomplete-dropdown-container">
                            {loading && <div style={{ padding: '2px 8px' }}>Loading...</div>}
                            {suggestions.map(suggestion => {
                              const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                              // inline style for demonstration purpose
                              const style = suggestion.active
                                ? {
                                    backgroundColor: '#fafafa',
                                    cursor: 'pointer'
                                  }
                                : {
                                    backgroundColor: '#ffffff',

                                    cursor: 'pointer'
                                  };

                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style
                                  })}
                                >
                                  <span>{suggestion.description}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <span style={{ color: 'red' }}>{this.state.errors['address1']}</span>
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Postal Code</label>
                  <input
                    name="postalcode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['postalcode'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'postalcode')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['postalcode']}</span>
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>City:</label>
                  <input
                    name="city"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['city'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'city')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['city']}</span>
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>State:</label>
                  <input
                    name="state"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['state'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'state')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['state']}</span>
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Country Name:</label>
                  <input
                    name="scountyname"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['scountyname'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'scountyname')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['scountyname']}</span>
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Country Code:</label>
                  <input
                    name="scountycode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['scountycode'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'scountycode')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['scountycode']}</span>
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Lat</label>
                  <input
                    name="lat"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['lat'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'lat')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['lat']}</span>
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Long</label>
                  <input
                    name="long"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['long'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'long')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['long']}</span>
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Icensu Year</label>
                  <input
                    name="icensusyear"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['icensusyear'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'icensusyear')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['icensusyear']}</span>
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>First Mortgage Loan Amount</label>
                  <input
                    name="firstMortgageAmount"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData['firstMortgageAmount'] || ''}
                    onChange={e => this.handleMortgageChange(e, 'firstMortgageAmount')}
                  />
                  <span style={{ color: 'red' }}>{this.state.errors['firstMortgageAmount']}</span>
                </div>
              </div>
              <div className="col-xs-12 nopad" style={{ marginTop: '5px' }}>
                <div className="col-xs-6 col-sm-2 col-md-2 col-lg-1 pull-right pad-half">
                  <button type="submit" className="btn btn-success btn-block">
                    Save
                  </button>
                </div>
                <div className="col-xs-6 col-sm-2 col-md-2 col-lg-1 pull-right pad-half">
                  <button type="button" className="btn btn-orange btn-block" onClick={this.cancelMortgageUpdation}>
                    Clear
                  </button>
                </div>
              </div>
            </Scrollbars>
          </form>
        </div>
      </div>
    );
  }
}

AddProperty.defaultProps = {
  userData: {}
};

AddProperty.propTypes = {
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    clearSelectedMortgageData: (searchMortgage, searchAdminText) =>
      dispatch(clearSelectedMortgageData(searchMortgage, searchAdminText)),
    saveSelectedMortgageData: (mortgageData, paymentData) =>
      dispatch(saveSelectedMortgageData(mortgageData, paymentData)),
    error: data => dispatch(error(data)),
    addPropertyData: (token, data) => dispatch(addPropertyData(token, data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddProperty));
