import { connect } from 'react-redux';
import { SelfGradeForm } from './SelfGradeForm';
import { Iprops } from './SelfGradeModal';


const mapStateToProps = (store: any) => {
  return {
    selfGrade: store.selfGradeReducer,
  }
}

const SelfGradeContainer:React.FC<Iprops> = connect(mapStateToProps)(SelfGradeForm);

export default SelfGradeContainer;