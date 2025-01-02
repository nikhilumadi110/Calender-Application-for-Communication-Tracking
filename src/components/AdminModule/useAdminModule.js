// src/components/AdminModule/useAdminModule.js
import { useState, useEffect, useCallback } from 'react';
import { COMPANIES_KEY, COMMUNICATION_METHODS_KEY, LOCAL_STORAGE_VERSION, LOCAL_STORAGE_VERSION_KEY } from '../../utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { initialCompanies, initialMethods } from './initialData';


const useAdminModule = () => {
  // Function to clear local storage if version changes
  const checkAndClearLocalStorage = () => {
    const storedVersion = localStorage.getItem(LOCAL_STORAGE_VERSION_KEY);

    if (storedVersion !== LOCAL_STORAGE_VERSION) {
          localStorage.removeItem(COMPANIES_KEY);
          localStorage.removeItem(COMMUNICATION_METHODS_KEY);
          localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, LOCAL_STORAGE_VERSION)
        return true; // Data was cleared
    }
    return false; // No data was cleared
};

  // State for managing companies
  const [companies, setCompanies] = useState(() => {
    if (checkAndClearLocalStorage()) return initialCompanies;
    const storedCompanies = localStorage.getItem(COMPANIES_KEY);
    try {
      return storedCompanies ? JSON.parse(storedCompanies) : initialCompanies;
    } catch (error) {
        console.error("Error parsing companies from local storage", error);
        return initialCompanies;
    }
  });

  // State for managing communication methods
  const [communicationMethods, setCommunicationMethods] = useState(() => {
      if (checkAndClearLocalStorage()) return initialMethods;
      const storedMethods = localStorage.getItem(COMMUNICATION_METHODS_KEY);
     try {
      return storedMethods ? JSON.parse(storedMethods) : initialMethods;
     } catch (error) {
        console.error("Error parsing communication methods from local storage", error);
        return initialMethods;
     }
  });

  // Function to persist data to local storage
   const persistData = useCallback((key, data) => {
        try {
           localStorage.setItem(key, JSON.stringify(data));
        } catch(error) {
            console.error(`Error saving ${key} to local storage`, error)
        }
    },[]);


  // Update local storage when companies change
  useEffect(() => {
        persistData(COMPANIES_KEY, companies)
    }, [companies, persistData]);

  // Update local storage when communication methods change
  useEffect(() => {
        persistData(COMMUNICATION_METHODS_KEY, communicationMethods);
  }, [communicationMethods, persistData]);

  // Function to add a new company
  const addCompany = (company) => {
    const newCompany = { ...company, id: uuidv4() };
     setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
  };

   // Function to update an existing company
  const updateCompany = (updatedCompany) => {
     setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      )
    );
  };


  // Function to delete a company
  const deleteCompany = (id) => {
      setCompanies((prevCompanies) => prevCompanies.filter((company) => company.id !== id));
  };

  // Function to add a new communication method
  const addCommunicationMethod = (method) => {
      const newMethod = { ...method, id: uuidv4() };
     setCommunicationMethods((prevMethods) => [...prevMethods, newMethod]);
  };


    // Function to update an existing communication method
    const updateCommunicationMethod = (updatedMethod) => {
       setCommunicationMethods((prevMethods) =>
         prevMethods.map((method) =>
            method.id === updatedMethod.id ? updatedMethod : method
         )
      );
    };


  // Function to delete a communication method
  const deleteCommunicationMethod = (id) => {
    setCommunicationMethods((prevMethods) =>
      prevMethods.filter((method) => method.id !== id)
    );
  };

  return {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    communicationMethods,
    addCommunicationMethod,
    updateCommunicationMethod,
    deleteCommunicationMethod,
  };
};

export default useAdminModule;