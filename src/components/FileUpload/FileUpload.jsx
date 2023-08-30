import React from 'react';
// used for making the prop types of this component
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import Button from 'components/CustomButtons/Button.jsx';
import NoticeModal from 'views/Components/NoticeModal.jsx';

const styles = {
  fileUpload: {
    display: 'flex',
  },
};

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.avatar || '',
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.closeNoticeModal = this.closeNoticeModal.bind(this);
  }
  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      // Max 1 MB size is allowed to upload
      if (file.size > 1000000) {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Out of Boundary',
          noticeModalErrMsg: 'Selected file size is more than 1 MB. Please select file with size less than 1 MB.',
        });
      } else if (this.props.supportedMimeType && this.props.supportedMimeType.indexOf(file.type) === -1) {
        this.setState({
          noticeModal: true,
          noticeModalHeader: 'Wrong File Type',
          noticeModalErrMsg: 'Selected file is not supported.\n Supported File Type are ' + this.props.supportedMimeType.toString(),
        });
      } else {
        this.setState(
          {
            file: file,
            imagePreviewUrl: file.name,
          },
          () => this.props.sendFile(file)
        );
      }
    };
    reader.readAsDataURL(file);
  }
  handleSubmit(e) {
    e.preventDefault();
    // this.state.file is the file/image uploaded
    // in this function you can save the image (this.state.file) on form submit
    // you have to call it yourself
  }
  handleClick() {
    this.refs.fileInput.click();
  }
  handleRemove() {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.avatar || '',
    });
    this.refs.fileInput.value = null;
    if(this.props.removeFile){
      this.props.removeFile()
    }
  }
  closeNoticeModal() {
    this.setState({
      noticeModal: false,
      noticeModalHeader: '',
      noticeModalErrMsg: '',
    });
  }
  render() {
    var { avatar, addButtonProps, changeButtonProps, removeButtonProps } = this.props;
    return (
      <>
        <div className='fileinput fileUpload text-left'>
          <input type='file' onChange={this.handleImageChange} ref='fileInput' />
          <div>
            {/* <img src={this.state.imagePreviewUrl} alt="..." /> */}
            <label>{this.state.imagePreviewUrl}</label>
          </div>
          <div>
            {this.state.file === null ? (
              <Button {...addButtonProps} onClick={() => this.handleClick()}>
                {avatar ? 'BROWSE' : 'Select image'}
              </Button>
            ) : (
              <span className='fileUpload'>
                <Button {...changeButtonProps} style={{ display: 'inline' }} onClick={() => this.handleClick()}>
                  Change
                </Button>
                {avatar ? <br /> : null}
                <Button {...removeButtonProps} style={{ display: 'inline' }} onClick={() => this.handleRemove()}>
                  <i className='fas fa-times' /> Remove
                </Button>
              </span>
            )}
          </div>
        </div>
        <NoticeModal
          noticeModal={this.state.noticeModal}
          noticeModalHeader={this.state.noticeModalHeader}
          noticeModalErrMsg={this.state.noticeModalErrMsg}
          closeModal={this.closeNoticeModal}
        />
      </>
    );
  }
}

FileUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object,
  supportedMimeType: PropTypes.array,
  sendFile: PropTypes.any,
};

export default withStyles(styles)(FileUpload);
