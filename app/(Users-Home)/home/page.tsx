import React from "react";
import { GraduationCap } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ThinkSync!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your account has been successfully created and you&apos;re now
            signed in.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎉 Success!
            </h2>
            <p className="text-gray-600">
              You can now start using ThinkSync. This is your home dashboard
              where you&apos;ll be able to access all your features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
