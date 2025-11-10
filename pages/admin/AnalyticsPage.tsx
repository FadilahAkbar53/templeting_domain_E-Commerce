import React from "react";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-theme-text-base mb-4">
          Analytics
        </h1>
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-theme-text-muted mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-theme-text-base mb-2">
            Coming Soon
          </h2>
          <p className="text-theme-text-muted text-center max-w-md">
            Advanced analytics and reporting features will be available here.
            Track your business metrics, sales trends, and customer behavior.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            <div className="bg-theme-bg-secondary p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-theme-primary mb-2">📊</p>
              <p className="font-semibold text-theme-text-base">
                Sales Analytics
              </p>
              <p className="text-sm text-theme-text-muted mt-1">
                Track sales performance
              </p>
            </div>
            <div className="bg-theme-bg-secondary p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-theme-primary mb-2">👥</p>
              <p className="font-semibold text-theme-text-base">
                User Insights
              </p>
              <p className="text-sm text-theme-text-muted mt-1">
                Understand user behavior
              </p>
            </div>
            <div className="bg-theme-bg-secondary p-6 rounded-lg text-center">
              <p className="text-3xl font-bold text-theme-primary mb-2">📈</p>
              <p className="font-semibold text-theme-text-base">
                Growth Metrics
              </p>
              <p className="text-sm text-theme-text-muted mt-1">
                Monitor business growth
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
