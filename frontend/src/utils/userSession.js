export const getActiveUserId = () => {
    // Check for existing first logged-in user in sessionStorage
    const firstUserId = sessionStorage.getItem('firstLoggedInUser');
    
    if (firstUserId) {
      // Return first logged-in user if exists
      return firstUserId;
    } else {
      // If no first user is set yet, get current user from localStorage
      const currentUserId = localStorage.getItem('uid');
      
      // If a user is logged in and no first user is set, set this as first user
      if (currentUserId) {
        sessionStorage.setItem('firstLoggedInUser', currentUserId);
        return currentUserId;
      }
      
      return null;
    }
  };
  
  export const clearActiveUser = () => {
    // Call this function during logout
    sessionStorage.removeItem('firstLoggedInUser');
  };