import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

class DeletePoolModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      if (document.getElementById('userDataElement')) {
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

  deletePool = () => {
    this.props.deletePool();
  };

  onDeleteCloseModal = () => {
    this.props.onDeleteCloseModal();
  };

  render() {
    return (
      <Modal
        open={this.props.isDeletedOpen}
        classNames={{ modal: 'custom-modal' }}
        onClose={this.onDeleteCloseModal}
        center
      >
        <h2 className="modal-header">{this.props.checked ? 'Un-Archive Pool' : 'Archive Pool'}</h2>
        <div className="modal-body">
          <p className="pad-down">
            {this.props.checked
              ? 'Are you sure you want to un-archive(show) this pool?'
              : 'Are you sure you want to archive(hide) this pool?'}
          </p>
          <div className="row">
            <div className="col-xs-3 col-xs-offset-6">
              <button onClick={() => this.deletePool()} className="btn btn-block orange-bg btn-own">
                YES
              </button>
            </div>
            <div className="col-xs-3 text-right">
              <button onClick={this.onDeleteCloseModal} className="btn btn-block orange-bg btn-own">
                NO
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

DeletePoolModal.defaultProps = {
  userData: {}
};

DeletePoolModal.propTypes = {
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
)(withRouter(DeletePoolModal));
