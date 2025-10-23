import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Section from '../components/Section';
import LoadingSpinner from '../components/LoadingSpinner';

interface ImpactNumbersForm {
  projectsCompleted: string;
  happyClients: string;
  yearsOfExperience: string;
}

type FormStatus = 'idle' | 'loading' | 'saving' | 'success' | 'error';

const AdminSettingsPage: React.FC = () => {
  const [formData, setFormData] = useState<ImpactNumbersForm>({
    projectsCompleted: '',
    happyClients: '',
    yearsOfExperience: '',
  });
  const [status, setStatus] = useState<FormStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setStatus('loading');
      try {
        const settingsDocRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            projectsCompleted: String(data.projectsCompleted || '0'),
            happyClients: String(data.happyClients || '0'),
            yearsOfExperience: String(data.yearsOfExperience || '0'),
          });
        }
        setStatus('idle');
      } catch (error) {
        console.error("Error fetching settings:", error);
        setMessage('Failed to load settings. Please try again.');
        setStatus('error');
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) { // Allow only digits
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setMessage('');

    const numbersToSave = {
        projectsCompleted: Number(formData.projectsCompleted),
        happyClients: Number(formData.happyClients),
        yearsOfExperience: Number(formData.yearsOfExperience),
    };

    try {
        const settingsDocRef = doc(db, 'settings', 'global');
        await setDoc(settingsDocRef, numbersToSave, { merge: true });
        setMessage('Impact numbers updated successfully!');
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
        console.error("Error saving settings:", error);
        setMessage('Failed to save settings. Please try again.');
        setStatus('error');
    }
  };

  const renderStatusMessage = () => {
    if (status === 'success') {
      return <p className="text-green-500 mt-4">{message}</p>;
    }
    if (status === 'error') {
      return <p className="text-red-500 mt-4">{message}</p>;
    }
    return null;
  };

  return (
    <div className="animate-fade-in-up pt-20">
      <Section>
        <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-light-text">Admin Settings</h1>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Update "Our Impact" Numbers</h2>
          
          {status === 'loading' ? (
            <div className="flex justify-center py-8">
                <LoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="projectsCompleted" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Projects Completed</label>
                <input 
                  type="text" 
                  id="projectsCompleted"
                  name="projectsCompleted" 
                  value={formData.projectsCompleted} 
                  onChange={handleChange}
                  pattern="\d*"
                  required 
                  className="w-full px-4 py-2 border rounded-md dark:bg-dark-bg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="happyClients" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Happy Clients</label>
                <input 
                  type="text" 
                  id="happyClients"
                  name="happyClients"
                  value={formData.happyClients} 
                  onChange={handleChange}
                  pattern="\d*"
                  required 
                  className="w-full px-4 py-2 border rounded-md dark:bg-dark-bg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="mb-6">
                <label htmlFor="yearsOfExperience" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Years of Experience</label>
                <input 
                  type="text" 
                  id="yearsOfExperience" 
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience} 
                  onChange={handleChange}
                  pattern="\d*"
                  required 
                  className="w-full px-4 py-2 border rounded-md dark:bg-dark-bg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'saving'} 
                className="w-full bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-hover transition-all duration-300 disabled:bg-primary/50 transform active:scale-95"
              >
                {status === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
              
              <div className="h-6 mt-4 text-center">
                {renderStatusMessage()}
              </div>
            </form>
          )}
        </div>
      </Section>
    </div>
  );
};

export default AdminSettingsPage;
