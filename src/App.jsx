import { useState, useEffect } from 'react';
import { Rocket, Search, Filter, CheckCircle2, XCircle, Calendar, ExternalLink, X, MapPin, PlayCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet icon issue in React
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [launches, setLaunches] = useState([]);
  const [launchpads, setLaunchpads] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  useEffect(() => {
    // Fetch both launches and launchpads concurrently
    Promise.all([
      fetch('https://api.spacexdata.com/v4/launches').then(res => res.json()),
      fetch('https://api.spacexdata.com/v4/launchpads').then(res => res.json())
    ])
    .then(([launchesData, launchpadsData]) => {
      // Create a dictionary for launchpads O(1) lookup
      const padsMap = launchpadsData.reduce((acc, pad) => ({ ...acc, [pad.id]: pad }), {});
      setLaunchpads(padsMap);

      const sortedData = launchesData.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
      setLaunches(sortedData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching SpaceX data:", err);
      setLoading(false);
    });
  }, []);

  // Extract unique years for the timeline
  const availableYears = ['All', ...Array.from(new Set(launches.map(l => new Date(l.date_utc).getFullYear()))).sort((a, b) => b - a)];

  const filteredLaunches = launches.filter(launch => {
    const matchesSearch = launch.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'success' 
        ? launch.success === true 
        : launch.success === false;
    const matchesYear = selectedYear === 'All' ? true : new Date(launch.date_utc).getFullYear() === selectedYear;
    
    return matchesSearch && matchesFilter && matchesYear;
  });

  const glassStyle = "bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]";

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans selection:bg-blue-500/30 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
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
              <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>All</button>
              <button onClick={() => setFilter('success')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'success' ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-green-400'}`}>Success</button>
              <button onClick={() => setFilter('failed')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'failed' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-red-400'}`}>Failed</button>
            </div>
          </div>
        </header>

        {/* Timeline Visualization */}
        {!loading && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Mission Timeline
            </h3>
            <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${selectedYear === year ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

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
                    <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20"><CheckCircle2 className="w-3.5 h-3.5" /> Success</span>
                  ) : launch.success === false ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20"><XCircle className="w-3.5 h-3.5" /> Failed</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">Pending</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{launch.name}</h3>
                
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(launch.date_utc).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                  {launch.details || "No details available for this mission yet."}
                </p>

                <button 
                  onClick={() => setSelectedLaunch(launch)}
                  className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-xl text-sm font-medium text-blue-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  View Details
                </button>
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

        {/* Modal Overlay */}
        {selectedLaunch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`${glassStyle} bg-[#0a0a0a]/90 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] border-gray-800 relative`}>
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-lg p-2 border border-white/10">
                    {selectedLaunch.links.patch.small ? (
                      <img src={selectedLaunch.links.patch.small} alt="patch" className="w-full h-full object-contain drop-shadow-md" />
                    ) : (
                      <Rocket className="w-6 h-6 text-gray-500 m-auto mt-1" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedLaunch.name}</h2>
                    <p className="text-gray-400 text-sm">{new Date(selectedLaunch.date_utc).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLaunch(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                
                {/* Description */}
                {selectedLaunch.details && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">Mission Overview</h3>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">{selectedLaunch.details}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Map Section */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-3 text-blue-400 flex items-center gap-2">
                      <MapPin className="w-5 h-5" /> Launchpad Location
                    </h3>
                    {launchpads[selectedLaunch.launchpad] ? (
                      <div className="h-[350px] w-full rounded-xl overflow-hidden border border-white/10 shadow-inner relative z-10">
                        {/* 
                          Using CartoDB Dark Matter tile layer for a sleek dark mode map 
                        */}
                        <MapContainer 
                          center={[launchpads[selectedLaunch.launchpad].latitude, launchpads[selectedLaunch.launchpad].longitude]} 
                          zoom={10} 
                          style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                        >
                          <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker position={[launchpads[selectedLaunch.launchpad].latitude, launchpads[selectedLaunch.launchpad].longitude]}>
                            <Popup className="text-sm font-sans">
                              <b className="text-blue-600 block mb-1">{launchpads[selectedLaunch.launchpad].name}</b>
                              {launchpads[selectedLaunch.launchpad].full_name}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    ) : (
                      <div className="h-[350px] w-full bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500">
                        Map data unavailable
                      </div>
                    )}
                    {launchpads[selectedLaunch.launchpad] && (
                      <p className="text-xs text-gray-500 mt-2 ml-1">
                        📍 {launchpads[selectedLaunch.launchpad].full_name}
                      </p>
                    )}
                  </div>

                  {/* Webcast Section */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-3 text-red-400 flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" /> Webcast Replay
                    </h3>
                    {selectedLaunch.links.youtube_id ? (
                      <div className="h-[350px] w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${selectedLaunch.links.youtube_id}`} 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="h-[350px] w-full bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500">
                        No webcast available for this mission.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
