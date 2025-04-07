import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import ProgressPlan from '../ProgressPlan';

const TodayPlan = ({dataPass, dataFail}: any) => {
  const totalQuestion = useSelector(
    (state: RootState) => state.createStepPlan.totalQuestion,
  );

  return (
    <ProgressPlan
      total={totalQuestion}
      correct={dataPass || 0}
      wrong={dataFail || 0}
      title="Today Plan"
    />
  );
};

export default TodayPlan;
