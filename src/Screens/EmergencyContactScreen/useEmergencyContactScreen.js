import {useState} from 'react';
import useFormHook from '../../Hooks/UseFormHooks';
import Schemas from '../../Utils/Validation';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import API from '../../Utils/helperFunc';
import {addContactsUrl, allContactsUrl} from '../../Utils/Urls';
import {filterKeyFromArry, getObjectById} from '../../Services/GlobalFunctions';

const useEmergencyContactScreen = () => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.logIn,
  );

  const {data} = useQuery({
    queryKey: ['allContacts'],
    queryFn: () => API.get(allContactsUrl),
  });

  console.log('datadatadatadatadatadata', data?.data);

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState({
    name: '',
    phone: '',
  });
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    img: '',
    id: null,
  });

  const [addedContacts, setAddedContacts] = useState([]);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setErrorMessage({
      name: null,
      phone: null,
    });
    setModal(!modal);
  };

  const onOpenModal = data => {
    setContactData(data);
    toggleModal();
  };

  const {mutate} = useMutation({
    mutationFn: body => {
      return API.post(addContactsUrl, body);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        queryClient.invalidateQueries({
          queryKey: ['allAppointData'],
        });
        queryClient.invalidateQueries({
          queryKey: ['homeData'],
        });
        successMessage(data?.message);
      } else errorMessage(data?.message);
    },
  });

  const regex = /^[A-Za-z ]*$/;

  const onSaveContact = ({name, phone, image, id}) => {
    console.log(
      filterKeyFromArry(addedContacts, 'id'),
      'oisdbvksbdoivbsdovbsdbo',
    );

    if (name == null || name == '' || !regex.test(name)) {
      setErrorMessage(prev => ({
        ...prev,
        name: `Please enter${regex.test(name) ? ' your name' : ' valid name'}`,
      }));
    } else if (phone == null || phone == '') {
      setErrorMessage(prev => ({name: null, phone: `Please enter you number`}));
    } else {
      if (id == filterKeyFromArry(addedContacts, 'id')?.id) {
        setAddedContacts(prev => [
          ...prev,
          {...getObjectById(id, addedContacts), name, phone, image, id},
        ]);
      } else if (id == filterKeyFromArry([], 'id')?.id) {
      } else setAddedContacts([...addedContacts, {name, phone, image, id}]);

      setErrorMessage({
        name: null,
        phone: null,
      });
      toggleModal();
    }
  };

  return {
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    onSaveContact,
    errorMessage,
    toggleModal,
    modalState: modal,
    contactData,
    onOpenModal,
    setContactData,
    allContacts: [],
    addedContacts,
  };
};

export default useEmergencyContactScreen;
