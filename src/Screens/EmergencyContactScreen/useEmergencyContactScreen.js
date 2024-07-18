import {useCallback, useState} from 'react';
import useFormHook from '../../Hooks/UseFormHooks';
import Schemas from '../../Utils/Validation';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import API, {formDataFunc} from '../../Utils/helperFunc';
import {
  addContactsUrl,
  allContactsUrl,
  deleteContactUrl,
  updateContactUrl,
} from '../../Utils/Urls';
import {
  filterKeyFromArry,
  getObjectById,
  updateArryObjById,
} from '../../Services/GlobalFunctions';

const useEmergencyContactScreen = () => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.logIn,
  );

  const {data} = useQuery({
    queryKey: ['allContacts'],
    queryFn: () => API.get(allContactsUrl),
  });

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
  const [onlyLocalCont, setOnlyLocalCont] = useState(false);

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

  const onRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ['allContacts'],
      staleTime: 1000,
    });
  }, []);

  const {mutate} = useMutation({
    mutationFn: body => {
      return formDataFunc(addContactsUrl, body, 'image');
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        queryClient.invalidateQueries({
          queryKey: ['allContacts'],
        });
        setAddedContacts([]);
        successMessage(data?.message);
      } else errorMessage(data?.message);
    },
  });
  const {mutateAsync} = useMutation({
    mutationFn: body => {
      return formDataFunc(updateContactUrl, body, 'image');
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        queryClient.invalidateQueries({
          queryKey: ['allContacts'],
        });
        setAddedContacts([]);
        setOnlyLocalCont(false);
        successMessage(data?.message);
      } else errorMessage(data?.message);
    },
  });
  const deleteContact = useMutation({
    mutationFn: body => {
      return API.post(deleteContactUrl, body);
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        queryClient.invalidateQueries({
          queryKey: ['allContacts'],
        });
        successMessage(data?.message);
      } else errorMessage(data?.message);
    },
  });

  const regex = /^[A-Za-z ]*$/;

  const onSaveContact = ({name, phone, image, id}) => {
    if (name == null || name == '' || !regex.test(name)) {
      setErrorMessage(prev => ({
        ...prev,
        name: `Please enter${regex.test(name) ? ' your name' : ' valid name'}`,
      }));
    } else if (phone == null || phone == '') {
      setErrorMessage(prev => ({name: null, phone: `Please enter you number`}));
    } else {
      if (id == getObjectById(addedContacts, id)?.id) {
        // setAddedContacts(
        //   updateArryObjById(addedContacts, id, {name, phone, image, id}),
        // );
        // mutate({name, phone, image, id});
      } else if (id == getObjectById(data?.data?.contacts, id)?.id) {
        setAddedContacts(
          updateArryObjById(data?.data?.contacts, id, {name, phone, image, id}),
        );
        setOnlyLocalCont(true);
        mutateAsync({name, phone, image, id});
      } else {
        setAddedContacts([...addedContacts, {name, phone, image, id}]);
        mutate({name, phone, image, id});
      }

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
    deleteContact,
    onRefresh,
    allContacts: onlyLocalCont
      ? addedContacts
      : [...(data?.data?.contacts ?? []), ...addedContacts],
    addedContacts,
  };
};

export default useEmergencyContactScreen;
