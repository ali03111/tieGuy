import {Dimensions, Platform} from 'react-native';

const useHomeScreen = ({addListener}) => {
  const {width, height} = Dimensions.get('window');
  const ACPT_RATIO = width / height;
  const latitudeDelta = Platform.OS == 'ios' ? 0.02 : 0.001;
  const laongituteDalta = latitudeDelta * ACPT_RATIO;

  return {
    laongituteDalta,
    latitudeDelta,
  };
};

export default useHomeScreen;
