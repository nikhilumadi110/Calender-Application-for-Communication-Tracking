// src/components/UserModule/useUserModule.jsx
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COMPANIES_KEY, COMMUNICATION_METHODS_KEY } from '../../utils/constants';
import { format, addDays, isAfter, isSameDay } from 'date-fns';
import { useLoading } from '../../context/LoadingContext';

const useUserModule = () => {
    const [companies, setCompanies] = useState(() => {
        const storedCompanies = localStorage.getItem(COMPANIES_KEY);
        if(storedCompanies) {
            return JSON.parse(storedCompanies);
        }
        return [];
    });
    const [communicationMethods, setCommunicationMethods] = useState(() => {
        const storedMethods = localStorage.getItem(COMMUNICATION_METHODS_KEY);
        if(storedMethods) {
            return JSON.parse(storedMethods);
        }
        return [];
    });
    const [communications, setCommunications] = useState(() => {
        const storedCommunications = localStorage.getItem('communications');
        if(storedCommunications){
            return JSON.parse(storedCommunications);
        }
        return [];
    });

      const { setLoading } = useLoading();

    useEffect(() => {
        localStorage.setItem('communications',JSON.stringify(communications));
    }, [communications]);

    useEffect(() => {
        localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
    }, [companies]);


    const logCommunication = async (companyId, communicationData) => {
        setLoading(true);
        try {
            const newCommunication = {
              id: uuidv4(),
               companyId: companyId,
                ...communicationData,
               date: new Date(communicationData.date).toISOString(),
            };
            setCommunications([...communications, newCommunication]);
            setCompanies((prevCompanies) => {
                return prevCompanies.map((company) => {
                    if(company.id === companyId){
                        const nextCommunicationDate = addDays(new Date(newCommunication.date), company.communicationPeriodicity).toISOString();
                      return {...company, lastCommunication: newCommunication.date, nextCommunication: nextCommunicationDate, nextCommunicationType: communicationData.communicationType };
                   }
                   return company;
               })
           })
        } catch (error) {
           console.error("Error logging communication:", error);
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
     } catch (error) {
          console.error("Error updating communication:", error);
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
        } catch(error){
             console.error("Error deleting communication:", error);
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