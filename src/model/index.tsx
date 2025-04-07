import {createRealmContext, useRealm} from '@realm/react';

export const getDataTopic = () => {
  const realm = useRealm();
  const res = realm.objects('Topic');
  return res;

  //   dispatch(setDataLocalTopic(res));
};
