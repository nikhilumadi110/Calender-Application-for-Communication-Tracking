// src/components/AdminModule/useAdminModule.js
import { useState, useEffect } from 'react';
import { COMPANIES_KEY, COMMUNICATION_METHODS_KEY } from '../../utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { initialCompanies, initialMethods } from './initialData';


const useAdminModule = () => {
  // State for managing companies
  const [companies, setCompanies] = useState(() => {
    const storedCompanies = localStorage.getItem(COMPANIES_KEY);
    if (storedCompanies) {
      return JSON.parse(storedCompanies);
    } else {
      // Initial company data if local storage is empty
      return initialCompanies
    }
  });

  // State for managing communication methods
  const [communicationMethods, setCommunicationMethods] = useState(() => {
    const storedMethods = localStorage.getItem(COMMUNICATION_METHODS_KEY);
    if (storedMethods) {
      return JSON.parse(storedMethods);
    } else {
      // Initial communication methods
      return initialMethods
    }
  });

  // Update local storage when companies change
  useEffect(() => {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
  }, [companies]);

  // Update local storage when communication methods change
  useEffect(() => {
    localStorage.setItem(COMMUNICATION_METHODS_KEY, JSON.stringify(communicationMethods));
  }, [communicationMethods]);

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