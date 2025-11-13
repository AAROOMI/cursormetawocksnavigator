import React, { useState, useEffect } from 'react';
import { getConfigSummary, type ConfigStatus } from '../lib/configCheck';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, CloseIcon } from './Icons';

/**
 * Configuration Status Banner Component
 * 
 * Displays the status of all configured services (Clerk, Supabase, Gemini)
 * Shows at the top of the app when in development mode
 */
export const ConfigStatusBanner: React.FC = () => {
  const [summary, setSummary] = useState(getConfigSummary());
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Update summary when component mounts
    setSummary(getConfigSummary());
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const hasWarnings = summary.missingOptional.length > 0;
  const hasErrors = summary.missingRequired.length > 0;

  return (
    <div className={`border-b ${hasErrors ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : hasWarnings ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {hasErrors ? (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : hasWarnings ? (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
            <div>
              <p className={`text-sm font-medium ${hasErrors ? 'text-red-800 dark:text-red-200' : hasWarnings ? 'text-yellow-800 dark:text-yellow-200' : 'text-green-800 dark:text-green-200'}`}>
                Configuration Status
              </p>
              {!isExpanded && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {summary.statuses.filter(s => s.configured).length} of {summary.statuses.length} services configured
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {isExpanded ? 'Hide' : 'Details'}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-2">
            {summary.statuses.map((status: ConfigStatus) => (
              <div
                key={status.service}
                className={`flex items-start space-x-3 p-2 rounded ${
                  status.configured
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : status.required
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-yellow-100 dark:bg-yellow-900/30'
                }`}
              >
                {status.configured ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <InformationCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {status.service}
                    {!status.required && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Optional)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {status.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

