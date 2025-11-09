
import { mockDrivers } from './mockData';
import type { Driver } from '../types';

// This is a MOCK service that simulates calls to the Gemini API.
// In a real application, this file would contain logic to interact with
// the @google/genai library.

const findDrivers = (query: string): Promise<Driver[]> => {
  console.log(`Simulating Gemini search for drivers with query: "${query}"`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulate AI by returning a random subset of drivers
      const shuffled = [...mockDrivers].sort(() => 0.5 - Math.random());
      const results = shuffled.slice(0, Math.floor(Math.random() * mockDrivers.length) + 1);
      resolve(results);
    }, 1000); // Simulate network latency
  });
};

export const geminiService = {
  findDrivers,
};
