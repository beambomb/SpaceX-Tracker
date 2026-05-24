import { useState, useEffect } from 'react';
import { Rocket, Search, Filter, CheckCircle2, XCircle, Calendar, ExternalLink } from 'lucide-react';

function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('https://api.spacexdata.com/v4/launches')
      .then(res => res.json())
      .then(data => {
        const sortedData = data.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
        setLaunches(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching SpaceX data:", err);
        setLoading(false);
      });
  }, []);

  const filteredLaunches = launches.filter(launch => {
    const matchesSearch = launch.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'success' 
        ? launch.success === true 
        : launch.success === false;
    return matchesSearch && matchesFilter;
  });

  const glassStyle = "bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]";

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Rocket className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                SpaceX Tracker
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 drop-shadow-md" />
              <input 
                type="text" 
                placeholder="Search missions..." 
                className={`w-full sm:w-64 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all ${glassStyle}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className={`flex items-center rounded-xl p-1 ${glassStyle}`}>
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('success')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'success' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-green-400'}`}
              >
                Success
              </button>
              <button 
                onClick={() => setFilter('failed')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'failed' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-red-400'}`}
              >
                Failed
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaunches.slice(0, 50).map((launch) => (
              <div key={launch.id} className={`${glassStyle} rounded-2xl p-6 group hover:border-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center p-2 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {launch.links.patch.small ? (
                      <img src={launch.links.patch.small} alt={`${launch.name} patch`} className="w-full h-full object-contain drop-shadow-lg" />
                    ) : (
                      <Rocket className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  {launch.success ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                  ) : launch.success === false ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                      <XCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      Pending
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{launch.name}</h3>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(launch.date_utc).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                  {launch.details || "No details available for this mission yet."}
                </p>

                {launch.links.webcast && (
                  <a 
                    href={launch.links.webcast} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                  >
                    Watch Webcast <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLaunches.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No missions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
