import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import {Alert} from 'react-native';
import apiInstances from './configApi';
import {store} from '../../store';
import {login} from '../../store/authSlice';
import {useNavigation} from '@react-navigation/native';
import {checkError} from '@/utils/helper';

// const token = useSelector((state: RootState) => state.user.token)
// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const API_URL = 'https://abc/api';

export const loginEmail = async (email: string, device_token: string) => {
  try {
    const response = await apiInstances.post(`/send-otp`, {
      email,
      device_token: device_token || 'abc1',
    });
    return response.data;
  } catch (error: any) {
    console.log('Error Request Email', error.message);
  }
};

export const logOutUser = async () => {
  try {
    const response = await apiInstances.post(`/logout`);
    return response.data;
  } catch (error: any) {
    console.log('Error Request Logout', error.message);
  }
};

export const removeAccount = async () => {
  try {
    const response = await apiInstances.post(`/request-delete-account`);
    return response.data;
  } catch (error: any) {
    console.log('Error removeAccount', error.message);
  }
};

export const verifyOtp = async (
  email: string,
  otp: string,
  device_token: string,
): Promise<any> => {
  try {
    const response = await apiInstances.post(`/login`, {
      email,
      otp,
      device_token,
    });
    const token = response?.data?.res?.original?.access_token;
    if (token) {
      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem('token', token);
      store.dispatch(login(token));
      // Làm mới token và lưu lại
      const refreshResponse = await refreshToken();
      if (refreshResponse) {
        const newToken = refreshResponse?.res?.access_token;

        if (newToken) {
          // Lưu token mới vào AsyncStorage
          await AsyncStorage.setItem('token', newToken);
          store.dispatch(login(newToken));
          // Cập nhật header Authorization cho các request tiếp theo
          apiInstances.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newToken}`;
        }
      }
    }
    return response.data;
  } catch (error: any) {
    console.log('Error Verify Code', error.message);
    throw error;
  }
};

export const refreshToken = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) throw new Error('No token found');
    // Đặt token cũ vào header Authorization để làm mới token
    apiInstances.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Gọi API để làm mới token
    const response = await apiInstances.post(`/refresh-token`);
    return response.data;
  } catch (error: any) {
    console.log('Error refreshToken', error.message);
    throw error;
  }
};

export const createStudyPlan = async (
  device_token: string,
  time_in_date: Date,
  minutes: string,
  day_in_week: any,
  start_date: any,
  end_date: any,
) => {
  try {
    const response = await apiInstances.post(`/study-plan-handle`, {
      device_token,
      time_in_date,
      minutes,
      day_in_week,
      start_date,
      end_date,
    });
    return response.data;
  } catch (error: any) {
    console.log('Error Create Study Plan', error);
  }
};

export const getLevel = async (id: number, page: number) => {
  try {
    const response = await apiInstances.get(
      `${API_URL}/list-level-by-topic/${id}`,
      {
        params: {
          page: page,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getQuestions = async (level_id: number) => {
  try {
    const response = await apiInstances.get(`${API_URL}/questions`, {
      params: {
        level_id: level_id,
      },
    });
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getPractice = async (page: number) => {
  try {
    const response = await apiInstances.get(`${API_URL}/practice`, {
      params: {
        page: page,
      },
    });
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getFinalTest = async (page: number) => {
  try {
    const response = await apiInstances.get(`${API_URL}/final-test`, {
      params: {
        page: page,
      },
    });
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getMasterDataTopic = async () => {
  try {
    const response = await axios.get(`${API_URL}/master-data-topic`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getMasterDataPractice = async () => {
  try {
    const response = await axios.get(`${API_URL}/master-data-practice`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getMasterDataFinalTest = async () => {
  try {
    const response = await axios.get(`${API_URL}/master-data-final-test`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getPlanAllReport = async () => {
  try {
    const response = await apiInstances.get(`/plan-all-report`);
    return response.data;
  } catch (error: any) {
    console.log('Error getPlanAllReport', error.message);
  }
};

export const getDaysDetailReport = async () => {
  try {
    const response = await apiInstances.get(`/topic-detail-report`);
    return response.data;
  } catch (error: any) {
    console.log('Error getDaysDetailReport', error.message);
  }
};

export const getPracticeDetailReport = async () => {
  try {
    const response = await apiInstances.get(`/practice-detail-report`);
    return response.data;
  } catch (error: any) {
    console.log('Error getPracticeDetailReport', error.message);
  }
};

export const getFinalTestDetailReport = async () => {
  try {
    const response = await apiInstances.get(`/final-test-detail-report`);
    return response.data;
  } catch (error: any) {
    console.log('Error getFinalTestDetailReport', error.message);
  }
};

export const getTopicDetailReport = async () => {
  try {
    const response = await apiInstances.get(`/topic-detail-report-topic`);
    return response.data;
  } catch (error: any) {
    console.log('Error getTopicDetailReport', error.message);
  }
};

export const getPassingRateTopic = async () => {
  try {
    const response = await apiInstances.get(`/topic-passing-rate`);
    return response.data;
  } catch (error: any) {
    console.log('Error getPassingRateTopic', error.message);
  }
};

export const getStudyPlan = async () => {
  try {
    const response = await apiInstances.get(`/study-plan`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getUserInfo = async () => {
  try {
    const response = await apiInstances.get(`/user-info`);
    return response.data;
  } catch (error: any) {
    console.log('Error getUserInfo', error.message);
  }
};

export const getCustomPractice = async (
  total_question_set: any,
  time_for_one: any,
  test_id: any,
) => {
  try {
    const response = await axios.get(
      `${API_URL}/practice-customize-questions`,
      {
        params: {
          time_for_one: time_for_one,
          total_question_set: total_question_set,
          test_id: test_id,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitTopic = async (
  test_id: any,
  total_time_do: any,
  answer: any,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiInstances.post(
      `${API_URL}/topic-submit`,
      {
        test_id: test_id,
        total_time_do: total_time_do,
        answer: answer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitAsyncTopic = async (submit_data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiInstances.post(
      `${API_URL}/topic-submit-sync`,
      {
        submit_data: submit_data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitAsyncPractice = async (submit_data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiInstances.post(
      `${API_URL}/practice-submit-sync`,
      {
        submit_data: submit_data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitAsyncFinalTest = async (submit_data: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/final-test-submit-sync`,
      {
        submit_data: submit_data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitPractice = async (
  test_id: any,
  total_time_do: any,
  answer: any,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/practice-submit`,
      {
        test_id: test_id,
        total_time_do: total_time_do,
        answer: answer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitCustomPractice = async (
  test_id: any,
  total_time_do: any,
  answer: any,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/practice-customize-submit`,
      {
        test_id: test_id,
        is_over_time_submit: 1,
        is_customize_test: 1,
        total_question_set: 10,
        total_time_set: 1800,
        total_time_do: 1800,
        time_for_one: 30,
        answer: answer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const submitFinalTest = async (
  test_id: any,
  total_time_do: any,
  answer: any,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/final-test-submit`,
      {
        test_id: test_id,
        total_time_do: total_time_do,
        answer: answer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const postRateQuiz = async (
  question_id: number,
  rate: number,
  comment: string,
) => {
  try {
    const response = await apiInstances.post(`/evaluate`, {
      question_id,
      rate,
      comment,
    });
    return response.data;
  } catch (error: any) {
    console.log('Error Request evaluate', error.message);
  }
};

export const like = async (question_id: any[]): Promise<void> => {
  try {
    const response = await apiInstances.post(`/favourite`, {
      question_id: question_id,
    });
    console.log('Success like', response);
    return response.data;
  } catch (error) {
    checkError(error);
  }
};

export const unlike = async (question_id: any[]): Promise<void> => {
  try {
    const response = await apiInstances.post(`/unfavourite`, {
      question_id: question_id,
    });
    return response.data;
  } catch (error) {
    checkError(error);
  }
};

export const getWrongQues = async () => {
  try {
    const response = await apiInstances.get(`/statistic-wrong-question`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getTotalQuestionApp = async () => {
  try {
    const response = await apiInstances.get(`/total-question-app`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getFavorites = async () => {
  try {
    const response = await apiInstances.get(`/statistic-favourite-question`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getWeak = async () => {
  try {
    const response = await apiInstances.get(`/statistic-weak-question`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getHardest = async () => {
  try {
    const response = await apiInstances.get(`/statistic-hardest-question`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getHome = async () => {
  try {
    const response = await apiInstances.get(`/home`);
    return response.data;
  } catch (error: any) {
    checkError(error);
    return {
      status: true,
      message: error.message,
      code: error?.response?.status,
    };
  }
};

export const getTodayPlan = async () => {
  try {
    const response = await apiInstances.get(`/today-plan`);
    return response.data;
  } catch (error: any) {
    checkError(error);
    return {status: true, message: error.message};
  }
};

export const getTodayPlanFinalTest = async () => {
  try {
    const response = await apiInstances.get(`/final-test-today-plan`);
    return response.data;
  } catch (error: any) {
    checkError(error);
    return {status: true, message: error.message};
  }
};

export const getTodayPlanPractice = async () => {
  try {
    const response = await apiInstances.get(`/practice-today-plan`);
    return response.data;
  } catch (error: any) {
    checkError(error);
    return {status: true, message: error.message};
  }
};

export const getTopicProgress = async (topicId: any) => {
  try {
    const response = await apiInstances.get(`/topic-progress`, {
      params: {
        m_topic_id: topicId,
      },
    });
    return response.data;
  } catch (error: any) {
    checkError(error);
    return {status: true, message: error.message};
  }
};

export const getAllTopic = async (page: number) => {
  try {
    const response = await apiInstances.get(`/topic`, {
      params: {
        page: page,
      },
    });
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};

export const getVersionData = async () => {
  try {
    const response = await axios.get(`${API_URL}/current-version-question`);
    return response.data;
  } catch (error: any) {
    if (error.message !== 'Network Error') Alert.alert('Error', error.message);
  }
};

export const resetProgress = async () => {
  try {
    const response = await apiInstances.get(`/revoke-user-data`);
    return response.data;
  } catch (error: any) {
    checkError(error);
  }
};
