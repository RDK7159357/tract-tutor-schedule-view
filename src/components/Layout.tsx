
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, User, Settings, Sparkles, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">TT</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">
                  TractTutor
                </h1>
              </div>
              <div className="ml-6 flex items-center">
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-700 flex items-center space-x-1 transition-colors duration-300">
                  {user.role === 'admin' ? (
                    <>
                      <Settings className="h-3 w-3" />
                      <span>Administrator</span>
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      <span>User</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.username}</span>
                    {user.department && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>{user.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
