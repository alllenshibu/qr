import { React, createContext, useState, useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useAlert } from '@/hooks/useAlert';
import { useAuth0 } from '@auth0/auth0-react';
import { useColorMode } from '@chakra-ui/react';
export const account = createContext();
const MyContext = ({ children }) => {
  const [accountDetails, setAccountDetails] = useState({
    firstName: '',
    lastName: '',
  });
  const [emailProjects, setEmailProjects] = useState([]);
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [participants, setParticipants] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [eventDetails, setEventDetails] = useState({});

  const { loading, get, put } = useFetch();
  const showAlert = useAlert();
  useEffect(() => {
    console.log(accountDetails);
  }, [accountDetails]);
  // useEffect(() => {
  //   const fetchAccountDetails = async () => {
  //     if (isAuthenticated) {
  //       const { data, status } = await get('/core/users/me');
  //       const response = await get('/core/users/mycreds');
  //       // //console.log(response, data);
  //       setAccountDetails((preValue) => ({ ...preValue, ...(data.accountDetails || {}) }));
  //     }
  //   };
  //   fetchAccountDetails();
  //   // //console.log('trigger');
  // }, [isAuthenticated]);
  // //console.log(accountDetails);
  const updateAccountDetails = async () => {
    const { data, status } = await put('/core/users/me', {}, accountDetails);
    // //console.log(data);
    if (status === 200) {
      showAlert({
        title: 'Success',
        description: 'Account details updated successfully.',
        status: 'success',
      });
      //console.log(data);
      setUserDetails((prev) => {
        return {
          ...prev,
          ...(data.accountDetails || {}),
        };
      });
    } else {
      showAlert({
        title: 'Error',
        description: data.error,
        status: 'error',
      });
    }
  };
  const [activeTab, setActiveTab] = useState('Participants');
  const [allAccounts, setAllAccounts] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div>
      <account.Provider
        value={{
          accountDetails,
          emailProjects,
          setEmailProjects,
          allAccounts,
          setAllAccounts,
          userDetails,
          setUserDetails,
          setAccountDetails,
          activeTab,
          setActiveTab,
          updateAccountDetails,
          participants,
          setParticipants,
          eventDetails,
          setEventDetails,
        }}
      >
        {children}
      </account.Provider>
    </div>
  );
};

export default MyContext;
