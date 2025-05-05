'use client';

import { useState } from 'react';
import { userService } from '@/services/userService';
import { residenceService } from '@/services/residenceService';
import { tripService } from '@/services/tripService';

export default function DebugPage() {
  const [output, setOutput] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const logResult = (result: any) => {
    setOutput(JSON.stringify(result, null, 2));
  };

  const handleError = (error: any) => {
    setOutput(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
      
      {/* User ID Input */}
      <div className="mb-6">
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter user ID"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* User Service Section */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">User Service</h2>
            <div className="space-y-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={async () => {
                  try {
                    if (!userId) {
                      throw new Error('Please enter a user ID');
                    }
                    const result = await userService.getUser(userId);
                    logResult(result);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Get User
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                onClick={async () => {
                  try {
                    if (!userId) {
                      throw new Error('Please enter a user ID');
                    }
                    const result = await userService.getCurrentTrip(userId);
                    logResult(result);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Get Current Trip
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                onClick={async () => {
                  try {
                    if (!userId) {
                      throw new Error('Please enter a user ID');
                    }
                    const result = await userService.getTotalDaysOnTrip(userId);
                    logResult({ totalDays: result });
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Get Total Days on Trip
              </button>
            </div>
          </div>

          {/* Residence Service Section */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Residence Service</h2>
            <div className="space-y-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={async () => {
                  try {
                    if (!userId) {
                      throw new Error('Please enter a user ID');
                    }
                    const result = await residenceService.checkContinuousResidence(userId);
                    logResult(result);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Check Continuous Residence
              </button>
            </div>
          </div>

          {/* Trip Service Section */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Trip Service</h2>
            <div className="space-y-2">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                onClick={async () => {
                  try {
                    if (!userId) {
                      throw new Error('Please enter a user ID');
                    }
                    const result = await tripService.getUserTrips(userId);
                    logResult(result);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Get User Trips
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2"
                onClick={async () => {
                  try {
                    if (!userId) {
                      throw new Error('Please enter a user ID');
                    }
                    const result = await tripService.getUpcomingTrips(userId);
                    logResult(result);
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                Get Upcoming Trips
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <pre className="font-mono text-sm overflow-auto max-h-[500px] whitespace-pre-wrap">
            {output || 'No output yet'}
          </pre>
        </div>
      </div>
    </div>
  );
}
