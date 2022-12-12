import env from 'react-native-config';

const config = {
  api: {
    host: env.BASE_URL,
    careerHost: env.CAREER_BASE_URL,
    adLogOut: env.AD_LOG_OUT_BASE_URL,
  },
};

const API_HOST = config.api.host;
const API_CAREER_HOST = config.api.host;

export { API_HOST, API_CAREER_HOST };

export default config;
