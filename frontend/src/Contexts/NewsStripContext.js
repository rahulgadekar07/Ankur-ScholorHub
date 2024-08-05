import React, { createContext, useState, useEffect } from 'react';

export const NewsStripContext = createContext();

export const NewsStripProvider = ({ children }) => {
  const [isNewsStripVisible, setIsNewsStripVisible] = useState(false);
  const apiUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchVisibilityStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/admin/newsstripvisibility`);
        if (!response.ok) {
          throw new Error('Failed to fetch NewsStrip visibility status');
        }
        const data = await response.json();
        setIsNewsStripVisible(data.isVisible);
      } catch (error) {
        console.error('Error fetching NewsStrip visibility status:', error);
      }
    };

    fetchVisibilityStatus();
  }, [apiUrl]);

  const toggleNewsStrip = async () => {
    const newVisibility = !isNewsStripVisible;
    setIsNewsStripVisible(newVisibility);

    try {
      const response = await fetch(`${apiUrl}/admin/newsstripvisibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVisible: newVisibility }),
      });

      if (!response.ok) {
        throw new Error('Failed to update NewsStrip visibility');
      }
    } catch (error) {
      console.error('Error updating NewsStrip visibility:', error);
      // Revert the state change if the update fails
      setIsNewsStripVisible(!newVisibility);
    }
  };

  return (
    <NewsStripContext.Provider value={{ isNewsStripVisible, toggleNewsStrip }}>
      {children}
    </NewsStripContext.Provider>
  );
};
