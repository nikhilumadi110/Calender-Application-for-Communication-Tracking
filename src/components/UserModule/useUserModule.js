// src/components/UserModule/useUserModule.jsx
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COMPANIES_KEY, COMMUNICATION_METHODS_KEY } from '../../utils/constants';
import { format, addDays, isAfter, isSameDay } from 'date-fns';
import { useLoading } from '../../context/LoadingContext';
import { toast } from 'react-toastify';


const useUserModule = () => {
    const [companies, setCompanies] = useState(() => {
        const storedCompanies = localStorage.getItem(COMPANIES_KEY);
         try {
            return storedCompanies ? JSON.parse(storedCompanies) : [];
          } catch (error) {
                console.error("Error parsing companies from local storage", error);
                toast.error("Error loading companies. Please try again later.", { theme: 'colored'});
                return [];
          }
    });
    const [communicationMethods, setCommunicationMethods] = useState(() => {
        const storedMethods = localStorage.getItem(COMMUNICATION_METHODS_KEY);
          try {
            return storedMethods ? JSON.parse(storedMethods) : [];
          } catch (error) {
              console.error("Error parsing communication methods from local storage", error);
                toast.error("Error loading communication methods. Please try again later.", { theme: 'colored'});
                return [];
            }
    });
    const [communications, setCommunications] = useState(() => {
        const storedCommunications = localStorage.getItem('communications');
         try {
            return storedCommunications ? JSON.parse(storedCommunications) : [];
        } catch (error) {
            console.error("Error parsing communications from local storage", error);
            toast.error("Error loading communications. Please try again later.", { theme: 'colored'});
            return [];
        }
    });

      const { setLoading } = useLoading();

    // Function to persist data to local storage
   const persistData = useCallback((key, data) => {
        try {
           localStorage.setItem(key, JSON.stringify(data));
        } catch(error) {
           console.error(`Error saving ${key} to local storage`, error)
             toast.error(`Error saving data. Please try again later.`, { theme: 'colored'});
        }
    },[]);

    useEffect(() => {
        persistData('communications', communications)
    }, [communications, persistData]);

    useEffect(() => {
       persistData(COMPANIES_KEY, companies);
    }, [companies, persistData]);


    const logCommunication = async (companyId, communicationData) => {
        setLoading(true);
        try {
            const newCommunication = {
              id: uuidv4(),
               companyId: companyId,
                ...communicationData,
               date: new Date(communicationData.date).toISOString(),
            };
            setCommunications(prevCommunications => [...prevCommunications, newCommunication]);
            setCompanies((prevCompanies) => {
                return prevCompanies.map((company) => {
                    if(company.id === companyId){
                        const nextCommunicationDate = addDays(new Date(newCommunication.date), company.communicationPeriodicity).toISOString();
                      return {...company, lastCommunication: newCommunication.date, nextCommunication: nextCommunicationDate, nextCommunicationType: communicationData.communicationType };
                   }
                   return company;
               })
           })
           toast.success("Communication logged successfully", { theme: "colored" })
        } catch (error) {
           console.error("Error logging communication:", error);
           toast.error("Failed to log communication. Please try again later.", { theme: 'colored' })
             // rethrow the error for the error boundary
           throw new Error("Failed to log communication.");
        } finally {
           setLoading(false);
        }
    };


   const updateCommunication = async (communicationId, updatedCommunicationData) => {
      setLoading(true);
      try {
          setCommunications(prevCommunications => {
              return prevCommunications.map(comm => {
                  if (comm.id === communicationId) {
                    return {...comm, ...updatedCommunicationData, date: new Date(updatedCommunicationData.date).toISOString() };
                 }
                 return comm;
            });
        });
         setCompanies(prevCompanies => {
              return prevCompanies.map((company) => {
                 const communication = communications.find(comm => comm.id === communicationId)
                  if (communication && communication.companyId === company.id) {
                       const nextCommunicationDate = addDays(new Date(updatedCommunicationData.date), company.communicationPeriodicity).toISOString();
                     return {...company, lastCommunication: updatedCommunicationData.date, nextCommunication: nextCommunicationDate, nextCommunicationType: updatedCommunicationData.communicationType };
                    }
                   return company;
             });
        });
       toast.success("Communication updated successfully", { theme: "colored" })
     } catch (error) {
          console.error("Error updating communication:", error);
            toast.error("Failed to update communication. Please try again later.", { theme: 'colored' })
        throw new Error("Failed to update communication.");
       } finally {
         setLoading(false);
        }
    };

    const deleteCommunication = async (communicationId) => {
        setLoading(true);
       try {
         setCommunications(prevCommunications => {
           return prevCommunications.filter(comm => comm.id !== communicationId)
          })
             toast.success("Communication deleted successfully", { theme: "colored" })
        } catch(error){
             console.error("Error deleting communication:", error);
           toast.error("Failed to delete communication. Please try again later.", { theme: 'colored' })
           throw new Error("Failed to delete communication.");
        }finally {
             setLoading(false);
        }
    }

    const getCompanyCommunication = (companyId) => {
        return communications.filter(comm => comm.companyId === companyId).sort((a,b) => new Date(b.date) - new Date(a.date));
    };


    const getCompanyNextCommunications = (company) => {
           const nextCommunications = [];
            let nextDate = company.nextCommunication ? new Date(company.nextCommunication) : new Date()
            for(let i = 0; i < 5; i++){
               nextCommunications.push(nextDate);
               nextDate = addDays(nextDate, company.communicationPeriodicity)
          }
      return nextCommunications;
  };


    const getCompanyNextCommunication = (company) => {
        return company.nextCommunication ? new Date(company.nextCommunication) : null;
    };

     const isOverdue = (company) => {
          const nextCommunicationDate = company.nextCommunication ? new Date(company.nextCommunication): new Date();
         return isAfter(new Date(), nextCommunicationDate);
  };

    const isDueToday = (company) => {
        const nextCommunicationDate = company.nextCommunication ? new Date(company.nextCommunication): new Date();
      return isSameDay(new Date(), nextCommunicationDate);
  };

    return {
        companies,
        communicationMethods,
        communications,
        logCommunication,
        getCompanyCommunication,
         getCompanyNextCommunications,
         getCompanyNextCommunication,
        isOverdue,
        isDueToday,
        updateCommunication,
        deleteCommunication,
    };
};

export default useUserModule;