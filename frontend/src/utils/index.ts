const getItem = <T>(key: string): T =>  JSON.parse(localStorage.getItem(key)!) 
    
const setItem = (key: string, value: string ) => localStorage.setItem(key, value);
const removeItem = (key: string) => localStorage.removeItem(key);

const getRequestQuery = (query: string) => {
    return new URLSearchParams(window.location.search).get(query)
}

const initializeServerSentEvent = () =>
  new EventSource(`${import.meta.env.VITE_API_BASE_URI}/notifications`, {
    withCredentials: true,
  });

  const handleValidationError = (error: any) => console.log(error)

  const showSessionExpiredAlert = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Basic browser confirm — replace with a modal in production (SweetAlert, shadcn, etc.)
      const confirmed = window.confirm(
        "Your session has expired. Please log in again to continue."
      );
      resolve(confirmed);
    });
  };

  
export { getItem, setItem, removeItem, getRequestQuery, initializeServerSentEvent, handleValidationError, showSessionExpiredAlert};