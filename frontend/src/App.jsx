import React, { useState, useEffect } from 'react';
import { 
  FaBolt, FaUsers, FaCheckCircle, FaExclamationCircle, 
  FaPlus, FaEdit, FaSpinner, FaTimes, FaCheck, 
  FaTimesCircle, FaInbox, FaChartBar, FaFilter 
} from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;
const App = () => {
  const [names, setNames] = useState('');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [fetchingLeads, setFetchingLeads] = useState(true);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ total: 0, verified: 0, toCheck: 0 });

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === filter));
    }
  }, [leads, filter]);

  useEffect(() => {
    const verified = leads.filter(l => l.status === 'Verified').length;
    const toCheck = leads.filter(l => l.status === 'To Check').length;
    setStats({ total: leads.length, verified, toCheck });
  }, [leads]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leads`);
      const result = await response.json();
      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setFetchingLeads(false);
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

      const response = await fetch(`${API_URL}/api/leads/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: nameList }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✓ ${result.data.length} leads processed successfully`);
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

  const getCountryFlag = (countryCode) => {
    const flags = {
      IN: '🇮🇳', US: '🇺🇸', CN: '🇨🇳', JP: '🇯🇵', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', 
      IT: '🇮🇹', ES: '🇪🇸', BR: '🇧🇷', CA: '🇨🇦', AU: '🇦🇺', RU: '🇷🇺', KR: '🇰🇷',
      MX: '🇲🇽', ID: '🇮🇩', TR: '🇹🇷', SA: '🇸🇦', ZA: '🇿🇦', AR: '🇦🇷', PL: '🇵🇱',
      NL: '🇳🇱', SE: '🇸🇪', CH: '🇨🇭', BE: '🇧🇪', AT: '🇦🇹', NO: '🇳🇴', DK: '🇩🇰'
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <FaBolt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Smart Lead Automation
          </h1>
          <p className="text-gray-600 text-lg">AI-Powered Lead Enrichment & Verification System</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Leads</p>
                <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaUsers className="w-7 h-7 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Verified</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{stats.verified}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.verified / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">To Check</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.toCheck}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaExclamationCircle className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.toCheck / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-indigo-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <FaPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Leads</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="names" className="block text-gray-700 font-semibold mb-3 text-lg">
                Enter Names (comma-separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="names"
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  placeholder="e.g., Peter, Aditi, Ravi, Satoshi, Maria, Chen"
                  className="w-full px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaEdit className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-8 py-4 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaBolt className="w-5 h-5 mr-2" />
                    Process Leads
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setNames('')}
                className="px-6 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
              >
                <FaTimes /> Clear
              </button>
            </div>
          </form>
          
          {message && (
            <div className={`mt-6 p-4 rounded-xl shadow-md animate-slideDown ${
              message.includes('successfully') 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200'
            }`}>
              <div className="flex items-center">
                {message.includes('successfully') ? (
                  <FaCheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <FaTimesCircle className="w-5 h-5 mr-2" />
                )}
                <span className="font-semibold">{message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Lead Results</h2>
          <div className="inline-flex rounded-xl shadow-lg overflow-hidden border border-indigo-200">
            {['All', 'Verified', 'To Check'].map((status) => (
              <button
                key={status}
                type="button"
                className={`px-6 py-3 text-sm font-bold transition-all duration-200 ${
                  filter === status
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-indigo-50'
                }`}
                onClick={() => setFilter(status)}
              >
                <span className="flex items-center gap-2">
                  {status === 'All' && <FaChartBar />}
                  {status === 'Verified' && <FaCheck />}
                  {status === 'To Check' && <FaExclamationCircle />}
                  {status}
                  {status === 'All' && <span className="ml-1 text-xs opacity-75">({stats.total})</span>}
                  {status === 'Verified' && <span className="ml-1 text-xs opacity-75">({stats.verified})</span>}
                  {status === 'To Check' && <span className="ml-1 text-xs opacity-75">({stats.toCheck})</span>}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          {fetchingLeads ? (
            <div className="p-12 text-center">
              <FaSpinner className="inline-block animate-spin h-12 w-12 text-indigo-600 mb-4" />
              <p className="text-gray-600">Loading leads...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    {[
                      { label: 'Name', icon: <FaUsers /> },
                      { label: 'Predicted Country', icon: '🌍' },
                      { label: 'Confidence Score', icon: <FaChartBar /> },
                      { label: 'Status', icon: <FaCheck /> }
                    ].map((header) => (
                      <th key={header.label} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                          {header.icon}
                          {header.label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead, index) => (
                      <tr 
                        key={lead._id} 
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{lead.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getCountryFlag(lead.country)}</span>
                            <span className="text-sm font-medium text-gray-900">{lead.country}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold text-gray-900">
                                  {(lead.probability * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    lead.probability >= 0.6 
                                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                      : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                  }`}
                                  style={{ width: `${lead.probability * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-4 py-2 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-full shadow-md ${
                              lead.status === 'Verified'
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                            }`}
                          >
                            {lead.status === 'Verified' ? (
                              <><FaCheck /> Verified</>
                            ) : (
                              <><FaExclamationCircle /> To Check</>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FaInbox className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-semibold">No leads found</p>
                          <p className="text-gray-400 text-sm mt-2">Add some names above to get started!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Auto-refreshes every 30 seconds • CRM sync runs every 4 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default App;

// Add custom CSS animations to index.css
