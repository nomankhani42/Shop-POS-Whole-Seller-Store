"use client";

import React from "react";
import { FaSpinner } from "react-icons/fa";

interface LoaderProgressProps {
  progress?: number; // Optional: If passed, shows progress bar; otherwise, shows spinner
  uploading?: boolean; // If true, displays upload progress
}

const LoaderProgress: React.FC<LoaderProgressProps> = ({ progress, uploading }) => {
  return (
    <div className="flex items-center space-x-2">
      {uploading ? (
        <>
          <FaSpinner className="animate-spin text-yellow-500 text-xl" />
          <span className="text-gray-600 text-sm">{progress}%</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <FaSpinner className="animate-spin text-yellow-500 text-xl" />
      )}
    </div>
  );
};

export default LoaderProgress;
