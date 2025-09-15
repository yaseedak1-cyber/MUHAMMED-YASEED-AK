import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AppState, Grade, Subject } from './types';
import HomeScreen from './components/HomeScreen';
import SubjectSelectionScreen from './components/SubjectSelectionScreen';
import ContentScreen from './components/ContentScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import EmailCaptureScreen from './components/EmailCaptureScreen';
import { AppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ currentView: 'home' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);

  useEffect(() => {
    try {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            setUserEmail(savedEmail);
        }
    } catch (error) {
        console.error('Could not access localStorage:', error);
    } finally {
        setIsLoadingEmail(false);
    }
  }, []);


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSetEmail = useCallback((email: string) => {
    try {
        localStorage.setItem('userEmail', email);
        setUserEmail(email);
    } catch (error) {
        console.error('Could not save email to localStorage:', error);
        setUserEmail(email); // Set in state anyway to proceed for the session
    }
  }, []);

  const selectGrade = useCallback((grade: Grade) => {
    setAppState({ currentView: 'subjectSelection', grade });
  }, []);

  const selectSubject = useCallback((subject: Subject) => {
    if (appState.grade) {
      setAppState({ currentView: 'content', grade: appState.grade, subject });
    }
  }, [appState.grade]);
  
  const goHome = useCallback(() => {
    setAppState({ currentView: 'home' });
  }, []);

  const goToAnalytics = useCallback(() => {
    setAppState({ currentView: 'analytics' });
  }, []);

  const goToSubjectSelection = useCallback(() => {
    if (appState.grade) {
      setAppState({ currentView: 'subjectSelection', grade: appState.grade });
    }
  }, [appState.grade]);

  const contextValue = useMemo(() => ({
      appState,
      selectGrade,
      selectSubject,
      goHome,
      goToSubjectSelection,
      goToAnalytics,
      isOnline,
  }), [appState, selectGrade, selectSubject, goHome, goToSubjectSelection, goToAnalytics, isOnline]);

  const renderContent = () => {
    switch (appState.currentView) {
      case 'home':
        return <HomeScreen />;
      case 'subjectSelection':
        return <SubjectSelectionScreen />;
      case 'content':
        return <ContentScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (isLoadingEmail) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900" />;
  }

  if (!userEmail) {
    return <EmailCaptureScreen onSetEmail={handleSetEmail} />;
  }


  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {!isOnline && (
          <div role="alert" className="fixed bottom-0 left-0 right-0 z-50 bg-red-600 text-white text-center p-3 font-semibold shadow-lg animate-pulse">
            You are currently offline. Functionality may be limited.
          </div>
        )}
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;