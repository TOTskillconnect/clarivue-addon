import { useState, useEffect } from 'react';
import { CLARIVUE_ENDPOINTS } from '../config/environment';

interface ClarivueUser {
  email: string;
  accountId: string;
  planType: 'free' | 'pro' | 'enterprise';
  features: string[];
  displayName: string;
}

interface AuthState {
  user: ClarivueUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useClarivueAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = localStorage.getItem('clarivue_auth_token');
      const tokenExpiry = localStorage.getItem('clarivue_token_expiry');
      
      if (!token || !tokenExpiry) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Check if token is expired
      if (new Date() > new Date(tokenExpiry)) {
        clearAuth();
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Verify token with Clarivue backend
      const response = await fetch(CLARIVUE_ENDPOINTS.AUTH_VERIFY, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData.valid) {
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          // Update stored user info
          localStorage.setItem('clarivue_user_info', JSON.stringify(userData));
        } else {
          clearAuth();
          setAuthState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: 'Invalid authentication'
          }));
        }
      } else {
        // Token invalid, clear stored data
        clearAuth();
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Authentication expired'
        }));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to verify authentication'
      }));
    }
  };

  const login = () => {
    // Open Clarivue authentication in popup
    const popup = window.open(
      CLARIVUE_ENDPOINTS.LOGIN + '?source=react_app',
      'clarivue-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for authentication completion
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Check if authentication was successful
        setTimeout(() => {
          checkAuthStatus();
        }, 1000);
      }
    }, 1000);

    // Cleanup if window is not closed after 5 minutes
    setTimeout(() => {
      clearInterval(checkClosed);
      if (popup && !popup.closed) {
        popup.close();
      }
    }, 300000);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('clarivue_auth_token');
      
      if (token) {
        // Optional: Call logout endpoint to invalidate server-side session
        try {
          await fetch(`${CLARIVUE_ENDPOINTS.AUTH_VERIFY}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.warn('Logout request failed:', error);
        }
      }

      clearAuth();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('clarivue_auth_token');
    localStorage.removeItem('clarivue_token_expiry');
    localStorage.removeItem('clarivue_user_info');
  };

  const hasFeature = (feature: string): boolean => {
    return authState.user?.features.includes(feature) || false;
  };

  const isPlanType = (planType: 'free' | 'pro' | 'enterprise'): boolean => {
    return authState.user?.planType === planType;
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    hasFeature,
    isPlanType,
    // Helper methods
    isProUser: isPlanType('pro'),
    isEnterpriseUser: isPlanType('enterprise'),
    hasToneAnalysis: hasFeature('tone-analysis'),
    hasAISuggestions: hasFeature('ai-suggestions'),
    hasAdvancedFeatures: hasFeature('advanced-analytics')
  };
}; 