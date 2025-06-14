import React from 'react';

const SettingsPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-700 text-white p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <ul className="space-y-4">
          <li className="hover:text-gray-300 cursor-pointer">Manage Profile</li>
          <li className="hover:text-gray-300 cursor-pointer">App Settings</li>
          <li className="hover:text-gray-300 cursor-pointer">Security</li>
          <li className="hover:text-gray-300 cursor-pointer">Notifications</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Settings Overview</h1>
        <p>Select a setting from the sidebar to view or modify options.</p>
      </main>
    </div>
  );
};

export default SettingsPage;
