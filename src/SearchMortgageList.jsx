import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { OnAccountList } from './actions/mortage-service/mortage-service-action';
import { filteMortgageList, updatedMortgageSearch } from './actions/admin/admin-action';
class SearchMortgage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: props.searchAdminText || '' };
    this.handleSearchUpdate = _.debounce(this.updatedSearch, 30);
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
    }

    if (this.props.clearText && this.state.searchText !== '') {
      this.resetSearch();
    }
  }

  componentDidUpdate = () => {
    if (this.props.clearText && this.state.searchText !== '') {
      this.resetSearch();
    }
  };

  updatedSearch = value => {
    this.props.updatedSearch(value);
  };

  handleInputChange = event => {
    this.setState({
      searchText: event.target.value
    });
    this.props.handleOnchange(event.target.value);
  };

  handleSubmit = event => {
    this.props.handleSubmit(this.state.searchText);
  };

  resetSearch = () => {
    this.setState({
      searchText: ''
    });
    this.props.handleReset();
  };

  render() {
    return (
      <div className="col-xs-12 form-group">
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            name="searchText"
            placeholder="Search..."
            value={this.state.searchText}
            onChange={this.handleInputChange}
            autoComplete="off"
          />
          <span style={{ paddingLeft: '5px' }} className="input-group-btn">
            <button
              type="button"
              onClick={() => this.handleSubmit()}
              disabled={!this.state.searchText.length}
              className="btn btn-orange"
            >
              Submit
            </button>
          </span>
          <span style={{ paddingLeft: '5px' }} className="input-group-btn">
            <button
              type="button"
              disabled={!this.state.searchText.length}
              onClick={this.resetSearch}
              className="btn btn-orange"
            >
              Clear
            </button>
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mortgageList: state.mortService.AccountList,
    searchAdminText: state.admin.searchAdminText,
    searchMortgage: state.admin.searchMortgage
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    accountList: data => dispatch(OnAccountList(data)),
    filteMortgageList: searchText => dispatch(filteMortgageList(searchText)),
    updatedSearch: searchText => dispatch(updatedMortgageSearch(searchText))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchMortgage);
