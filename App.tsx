
import React, { useState, useEffect } from 'react';
import { AppState, EventLog, Whisky, InventoryItem } from './types';
import { DIAGEO_WHISKIES, BOTTLE_UNIT_CL, CL_STEP } from './constants';
import Layout from './components/Layout';
import WhiskySlider from './components/WhiskySlider';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.DASHBOARD);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventLog | null>(null);
  const [selectedWhiskies, setSelectedWhiskies] = useState<Whisky[]>([]);
  
  // Create Event Form State
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    organizer: '',
    ambassador: ''
  });

  // Load from storage
  useEffect(() => {
    const saved = localStorage.getItem('diageo_whisky_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Laden van evenementen mislukt", e);
      }
    }
  }, []);

  // Save to storage
  useEffect(() => {
    localStorage.setItem('diageo_whisky_events', JSON.stringify(events));
  }, [events]);

  const startInventoryEntry = () => {
    if (!eventFormData.title || !eventFormData.location || !eventFormData.ambassador) {
      alert("Vul alle verplichte velden in aub.");
      return;
    }
    if (selectedWhiskies.length === 0) {
      alert("Selecteer ten minste één whisky voor het evenement.");
      return;
    }
    
    const newEvent: EventLog = {
      id: crypto.randomUUID(),
      ...eventFormData,
      inventory: selectedWhiskies.map(w => ({
        whiskyId: w.id,
        startCl: 70 // default naar 70cl
      })),
      status: 'actief',
      createdAt: Date.now()
    };
    
    setActiveEvent(newEvent);
    setCurrentScreen(AppState.INVENTORY_START);
  };

  const updateInventoryValue = (whiskyId: string, value: number, isStart: boolean) => {
    if (!activeEvent) return;
    
    const updatedInventory = activeEvent.inventory.map(item => {
      if (item.whiskyId === whiskyId) {
        return isStart ? { ...item, startCl: value } : { ...item, endCl: value };
      }
      return item;
    });

    setActiveEvent({ ...activeEvent, inventory: updatedInventory });
  };

  const finalizeStartInventory = () => {
    if (!activeEvent) return;
    setCurrentScreen(AppState.DASHBOARD);
    setEvents(prev => [activeEvent, ...prev]);
    setActiveEvent(null);
    setSelectedWhiskies([]);
    setEventFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      organizer: '',
      ambassador: ''
    });
  };

  const openEvent = (event: EventLog) => {
    setActiveEvent(event);
    setCurrentScreen(AppState.EVENT_DETAIL);
  };

  const startEndInventory = () => {
    if (!activeEvent) return;
    const endInventory = activeEvent.inventory.map(item => ({
      ...item,
      endCl: item.endCl ?? item.startCl
    }));
    setActiveEvent({ ...activeEvent, inventory: endInventory });
    setCurrentScreen(AppState.INVENTORY_END);
  };

  const completeEvent = () => {
    if (!activeEvent) return;
    const completedEvent: EventLog = { ...activeEvent, status: 'voltooid' };
    setEvents(prev => prev.map(e => e.id === completedEvent.id ? completedEvent : e));
    setActiveEvent(completedEvent);
    setCurrentScreen(AppState.EVENT_DETAIL);
  };

  const deleteEvent = (id: string) => {
    if (confirm("Weet je zeker dat je dit evenement wilt verwijderen?")) {
      setEvents(prev => prev.filter(e => e.id !== id));
      setCurrentScreen(AppState.DASHBOARD);
      setActiveEvent(null);
    }
  };

  const toggleWhiskySelection = (whisky: Whisky) => {
    setSelectedWhiskies(prev => 
      prev.find(w => w.id === whisky.id) 
        ? prev.filter(w => w.id !== whisky.id)
        : [...prev, whisky]
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Evenementenoverzicht</h2>
        <button 
          onClick={() => setCurrentScreen(AppState.CREATE_EVENT)}
          className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold hover:bg-[#c49e2e] transition-colors"
        >
          Nieuw Evenement
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-[#151515] rounded-xl border border-dashed border-gray-700">
          <p className="text-gray-500 italic">Nog geen evenementen geregistreerd.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <div 
              key={event.id} 
              onClick={() => openEvent(event)}
              className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 hover:border-[#D4AF37]/40 cursor-pointer transition-all flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                <div className="mt-2">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${event.status === 'voltooid' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              <div className="text-[#D4AF37]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreateEvent = () => (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-[#D4AF37]">Details Evenement</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Naam Evenement</label>
            <input 
              type="text" 
              placeholder="bijv. Islay Tasting Night"
              className="w-full bg-black border border-gray-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none"
              value={eventFormData.title}
              onChange={e => setEventFormData({ ...eventFormData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Datum</label>
              <input 
                type="date" 
                className="w-full bg-black border border-gray-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none"
                value={eventFormData.date}
                onChange={e => setEventFormData({ ...eventFormData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-1">Locatie</label>
              <input 
                type="text" 
                placeholder="Amsterdam"
                className="w-full bg-black border border-gray-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none"
                value={eventFormData.location}
                onChange={e => setEventFormData({ ...eventFormData, location: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Organisator</label>
            <input 
              type="text" 
              placeholder="bijv. Gall & Gall"
              className="w-full bg-black border border-gray-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none"
              value={eventFormData.organizer}
              onChange={e => setEventFormData({ ...eventFormData, organizer: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Naam Ambassadeur</label>
            <input 
              type="text" 
              className="w-full bg-black border border-gray-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none"
              value={eventFormData.ambassador}
              onChange={e => setEventFormData({ ...eventFormData, ambassador: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">Selecteer Whisky's</h2>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
          {DIAGEO_WHISKIES.map(whisky => (
            <div 
              key={whisky.id} 
              onClick={() => toggleWhiskySelection(whisky)}
              className={`p-3 rounded border cursor-pointer flex justify-between items-center transition-all ${
                selectedWhiskies.find(w => w.id === whisky.id) 
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white' 
                : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="font-medium">{whisky.name}</span>
              {selectedWhiskies.find(w => w.id === whisky.id) && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#D4AF37]">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setCurrentScreen(AppState.DASHBOARD)}
          className="flex-1 border border-gray-700 text-gray-400 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
        >
          Annuleren
        </button>
        <button 
          onClick={startInventoryEntry}
          className="flex-[2] bg-[#D4AF37] text-black px-10 py-3 rounded-lg font-bold hover:bg-[#c49e2e] transition-colors shadow-lg shadow-yellow-900/10"
        >
          Start Evenement
        </button>
      </div>
    </div>
  );

  const renderInventoryScreen = (isStart: boolean) => {
    if (!activeEvent) return null;

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#D4AF37]">
            {isStart ? "Beginvoorraad Registreren" : "Eindvoorraad Registreren"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isStart 
              ? "Voer het aantal cl in waarmee je begint (bijv. 140 voor 2 flessen)." 
              : "Gebruik de slider om het resterende niveau per fles aan te geven."}
          </p>
        </div>

        <div className="space-y-4">
          {activeEvent.inventory.map(item => {
            const whisky = DIAGEO_WHISKIES.find(w => w.id === item.whiskyId);
            if (!whisky) return null;
            
            if (isStart) {
              return (
                <div key={whisky.id} className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{whisky.name}</h3>
                      <p className="text-gray-500 text-xs italic">{whisky.distillery}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        step={CL_STEP}
                        min="0"
                        className="w-32 bg-black border border-gray-800 rounded px-3 py-2 text-right focus:border-[#D4AF37] outline-none text-xl font-serif text-[#D4AF37]"
                        value={item.startCl}
                        onChange={(e) => updateInventoryValue(whisky.id, parseInt(e.target.value, 10) || 0, true)}
                      />
                      <span className="text-gray-500 font-bold">cl</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <WhiskySlider 
                key={whisky.id}
                whisky={whisky}
                valueCl={item.endCl ?? item.startCl}
                onChange={(val) => updateInventoryValue(whisky.id, val, false)}
                maxCl={Math.max(210, item.startCl)} 
              />
            );
          })}
        </div>

        <div className="sticky bottom-4 pt-4 bg-[#0c0c0c]/80 backdrop-blur-sm">
          <button 
            onClick={isStart ? finalizeStartInventory : completeEvent}
            className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#c49e2e] transition-colors shadow-2xl shadow-yellow-900/30"
          >
            Bevestig {isStart ? "Beginvoorraad" : "Eindvoorraad"}
          </button>
        </div>
      </div>
    );
  };

  const renderEventDetail = () => {
    if (!activeEvent) return null;

    const totalConsumed = activeEvent.inventory.reduce((sum, item) => {
      const consumption = item.endCl !== undefined ? Math.max(0, item.startCl - item.endCl) : 0;
      return sum + consumption;
    }, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <button 
            onClick={() => setCurrentScreen(AppState.DASHBOARD)}
            className="text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Terug
          </button>
          <button 
            onClick={() => deleteEvent(activeEvent.id)}
            className="text-red-900 hover:text-red-500 text-xs uppercase tracking-widest font-bold transition-colors"
          >
            Verwijderen
          </button>
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-gray-800 border-t-4 border-t-[#D4AF37] shadow-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4">{activeEvent.title}</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm border-b border-gray-800 pb-6 mb-6">
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Datum</p>
                <p className="font-semibold">{activeEvent.date}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Locatie</p>
                <p className="font-semibold">{activeEvent.location}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Organisator</p>
                <p className="font-semibold">{activeEvent.organizer}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-1">Ingevuld door</p>
                <p className="font-semibold">{activeEvent.ambassador}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-[#D4AF37] uppercase tracking-widest">Verbruiksrapport</h3>
              {activeEvent.status === 'voltooid' && (
                <div className="text-right">
                   <p className="text-[10px] text-gray-500 uppercase">Totaal Uitgeschonken</p>
                   <p className="text-2xl font-serif text-white">{totalConsumed} cl</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {activeEvent.inventory.map(item => {
                const whisky = DIAGEO_WHISKIES.find(w => w.id === item.whiskyId);
                const consumed = item.endCl !== undefined ? Math.max(0, item.startCl - item.endCl) : 0;
                
                return (
                  <div key={item.whiskyId} className="flex justify-between items-center bg-black/40 p-4 rounded-lg border border-gray-900 hover:border-gray-800 transition-colors">
                    <div>
                      <h4 className="font-semibold text-gray-100">{whisky?.name}</h4>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Start: {item.startCl} cl</span>
                        {item.endCl !== undefined && (
                          <span>Eind: {item.endCl} cl</span>
                        )}
                      </div>
                    </div>
                    {item.endCl !== undefined && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase">Verbruikt</p>
                        <p className="text-[#D4AF37] font-serif font-bold text-lg">{consumed} cl</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {activeEvent.status === 'actief' && (
            <div className="mt-8">
              <button 
                onClick={startEndInventory}
                className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#c49e2e] transition-all shadow-lg"
              >
                Evenement Afsluiten & Eindstand Meten
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {currentScreen === AppState.DASHBOARD && renderDashboard()}
      {currentScreen === AppState.CREATE_EVENT && renderCreateEvent()}
      {currentScreen === AppState.INVENTORY_START && renderInventoryScreen(true)}
      {currentScreen === AppState.INVENTORY_END && renderInventoryScreen(false)}
      {currentScreen === AppState.EVENT_DETAIL && renderEventDetail()}
    </Layout>
  );
};

export default App;
