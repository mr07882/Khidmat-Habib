import React from 'react';
import {DownloadsComp} from '../Components';
import {connect} from 'react-redux';

function DownloadTabs(props) {
  return <DownloadsComp props={props} />;
}
const mapStateToProps = state => {
  return {downloads: state.reducer.downloads};
};

export default connect(mapStateToProps)(DownloadTabs);
