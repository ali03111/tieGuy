import {useState} from 'react';
import {Dimensions, Platform} from 'react-native';

const useHomeScreen = ({addListener, navigate}) => {
  const {width, height} = Dimensions.get('window');
  const ACPT_RATIO = width / height;
  const latitudeDelta = Platform.OS == 'ios' ? 0.02 : 0.001;
  const laongituteDalta = latitudeDelta * ACPT_RATIO;

  const [locationData, setLocationData] = useState({
    startLocation: {
      description: '',
      coorads: {
        lat: '',
        long: '',
      },
    },
    endLocation: {
      description: '',
      coorads: {
        lat: '',
        long: '',
      },
    },
    startTracking: false,
  });

  // Function to update the description
  const updateDescription = (locationType, newDescription) => {
    setLocationData(prevState => ({
      ...prevState,
      [locationType]: {
        ...prevState[locationType],
        description: newDescription,
      },
    }));
  };

  const {startLocation, endLocation, startTracking} = locationData;

  const updateState = data => setLocationData(prev => ({...prev, ...data}));

  const dynamicNav = (route, item) => navigate(route, item);

  const valChange = (key, val) => {
    updateState({[key]: val});
  };

  return {
    laongituteDalta,
    latitudeDelta,
    valChange,
    dynamicNav,
    updateState,
    startLocation,
    endLocation,
    updateDescription,
  };
};

export default useHomeScreen;
