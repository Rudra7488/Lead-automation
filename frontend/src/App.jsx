import React, { useState, useEffect } from 'react';

const App = () => {
  const [names, setNames] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === filter));
    }
  }, [leads, filter]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const nameList = names.split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (nameList.length === 0) {
        setMessage('Please enter at least one name');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/leads/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: nameList }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`${result.data.length} leads processed successfully`);
        fetchLeads();
        setNames('');
      } else {
        setMessage(result.error || 'Error processing leads');
      }
    } catch (error) {
      console.error('Error submitting names:', error);
      setMessage('Error submitting names');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 drop-shadow-lg">
          🚀 Smart Lead Automation System
        </h1>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-indigo-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="names" className="block text-indigo-700 font-semibold mb-2">
                Enter Names (comma-separated)
              </label>
              <input
                type="text"
                id="names"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder="e.g., Peter, Aditi, Ravi, Satoshi"
                className="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium shadow-md transition-transform transform hover:scale-105 ${
                loading ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              }`}
            >
              {loading ? 'Processing...' : 'Submit Names'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md shadow-sm ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-md overflow-hidden">
            {['All', 'Verified', 'To Check'].map((status, idx) => (
              <button
                key={status}
                type="button"
                className={`px-5 py-2 text-sm font-semibold transition-colors ${
                  filter === status
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-indigo-50'
                } border border-indigo-200 ${idx === 0 ? 'rounded-l-md' : ''} ${idx === 2 ? 'rounded-r-md' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
          <table className="min-w-full divide-y divide-indigo-100">
            <thead className="bg-indigo-50">
              <tr>
                {['Name', 'Predicted Country', 'Confidence Score', 'Status'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(lead.probability * 100).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                          lead.status === 'Verified'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No leads found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
