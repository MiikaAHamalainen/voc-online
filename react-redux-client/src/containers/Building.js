import { connect } from 'react-redux';
import * as vocActions from '../actions/buildingActions';
import * as fileActions from '../actions/fileActions';
import Building from '../components/Building';

// map state from store to props
const mapStateToProps = (state) => {
  return {
    //you can now say this.props.mappedAppSate
    mappedBuildingState: state.buildingState,
    mappedAppState: state.appState
  }
}

// map actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    //you can now say this.props.mappedAppActions
    mappedfetchBuildingById: bid => dispatch(vocActions.fetchBuildingById(bid)),
    mappedShowCalcPointAddModal: () => dispatch(vocActions.addCalcPointModal()),
    mappedAddCalcPoint: calcPoint => dispatch(vocActions.addNewCalcPoint(calcPoint)),
    mappedHideCalcPointAddModal: () => dispatch(vocActions.hideCalcPointAddModal()),

    mappedEditCalcPoint: calcPointToEdit => dispatch(vocActions.editCalcPoint(calcPointToEdit)),
    mappedShowCalcPointEditModal: calcPointToEdit => dispatch(vocActions.showCalcPointEditModal(calcPointToEdit)),
    mappedHideCalcPointEditModal: () => dispatch(vocActions.hideCalcPointEditModal()),
    
    mappedDeleteCalcPoint: calcPointToDelete => dispatch(vocActions.deleteCalcPoint(calcPointToDelete)),
    mappedShowCalcPointDeleteModal: calcPointToDelete => dispatch(vocActions.showCalcPointDeleteModal(calcPointToDelete)),
    mappedHideCalcPointDeleteModal: () => dispatch(vocActions.hideCalcPointDeleteModal()),
    mappedFileDownload: (fileId, name) => dispatch(fileActions.fileDownload(fileId, name))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Building);
