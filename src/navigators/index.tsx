import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './drawer';
import SplashScreenComponent from '@/components/SplashScreen/SplashScreen';
import {
  getMasterDataFinalTest,
  getMasterDataPractice,
  getMasterDataTopic,
  getVersionData,
} from '@/services/api/api';
import {useQuery, useRealm} from '@realm/react';
import {setDataWrong} from '@/store/quesStatis';
import {setDataLocalTopic} from '@/store/topics';
import {setDataLocalPractice} from '@/store/practice';
import {setDataLocalFinalTest} from '@/store/finalTest';
import WrongQuestion from '@/model/wrong_question';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Topic from '@/model/topic';
import Practice from '@/model/practice';
import FinalTest from '@/model/final_test';
import {setDataConfig} from '@/store/config';
import {RootState} from '@/store';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const listTopic = useQuery(Topic);
  const listPractice = useQuery(Practice);
  const listFinalTest = useQuery(FinalTest);
  const [isSplashScreenVisible, setSplashScreenVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const realm = useRealm();
  const dispatch = useDispatch();
  const listWrongQuestion = useQuery(WrongQuestion);
  const dataConfig = useSelector((state: RootState) => state.config.dataConfig);

  useEffect(() => {
    const getDataVersion = async () => {
      const data = await getVersionData();
      const res = data?.res;
      if (
        res !== undefined &&
        (dataConfig?.topic_test_version != res?.topic_test_version ||
          dataConfig?.practice_test_version != res?.practice_test_version ||
          dataConfig?.final_test_version != res?.final_test_version ||
          !listTopic ||
          listTopic?.length == 0 ||
          !listPractice ||
          listPractice?.length == 0 ||
          !listFinalTest ||
          listFinalTest?.length == 0)
      ) {
        fetchMasterDataAll();
        dispatch(setDataConfig(res));
      }
    };
    SplashScreen.hide();
    const timer = setTimeout(() => {
      setSplashScreenVisible(false);
    }, 2500);

    if (
      !listTopic ||
      listTopic?.length == 0 ||
      !listPractice ||
      listPractice?.length == 0 ||
      !listFinalTest ||
      listFinalTest?.length == 0
    ) {
      setLoading(true);
      getDataVersion();
    }

    return () => clearTimeout(timer);
  }, []);

  const fetchMasterDataAll = async () => {
    const [resDataTopic, resDataPractice, resDataFinalTest] = await Promise.all(
      [getMasterDataTopic(), getMasterDataPractice(), getMasterDataFinalTest()],
    );
    try {
      realm.write(() => {
        realm.deleteAll();
        realm.delete(listWrongQuestion);
      });
      dispatch(setDataWrong([]));
      if (resDataTopic && resDataTopic.res && resDataTopic.res.data) {
        realm.write(() => {
          resDataTopic.res.data.forEach((obj: any) => {
            realm.create('Topic', obj);
          });
        });
        dispatch(setDataLocalTopic(resDataTopic.res.data));
      }

      if (resDataPractice && resDataPractice.res && resDataPractice.res.data) {
        realm.write(() => {
          resDataPractice.res.data.forEach((obj: any) => {
            realm.create('Practice', obj);
          });
        });
        dispatch(setDataLocalPractice(resDataPractice.res.data));
      }

      if (
        resDataFinalTest &&
        resDataFinalTest.res &&
        resDataFinalTest.res.data
      ) {
        realm.write(() => {
          resDataFinalTest.res.data.forEach((obj: any) => {
            realm.create('FinalTest', obj);
          });
        });
        dispatch(setDataLocalFinalTest(resDataFinalTest.res.data));
      }
    } finally {
      setSplashScreenVisible(false);
      setLoading(false);
    }
  };
  return (
    <NavigationContainer>
      {isSplashScreenVisible ? (
        <SplashScreenComponent loading={loading} />
      ) : (
        <DrawerNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
