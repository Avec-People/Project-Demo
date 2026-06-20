import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAppState } from '../context/AppStateContext';
import { VEHICLES_DATA } from '../constants/vehicles';

export default function MapViewport({ onSelectDriver }) {
  const {
    language,
    theme,
    selectedVehicleId, setSelectedVehicleId,
    dict
  } = useAppState();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({}); // { [vehicleId]: LeafletMarker }

  // Filter chips state
  const [filters, setFilters] = useState({
    bestDriver: false,
    bestCar: false,
    bestRating: false
  });

  // Local copy of vehicles coordinate details for GPS drift simulation
  const [vehicles, setVehicles] = useState(() => 
    VEHICLES_DATA.map(v => ({ ...v }))
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Egypt (Cairo) center
    const center = [30.0444, 31.2357];
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update Theme Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = theme === "dark" 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
    
    const layer = L.tileLayer(tileUrl, { attribution });
    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [theme]);

  // Update Markers based on Filters and coordinate updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const isFR = language === "FR";

    // Clear old markers that no longer match filters
    Object.keys(markersRef.current).forEach(id => {
      const v = vehicles.find(x => x.id === id);
      const matchesFilter = v && (
        (!filters.bestDriver || v.bestDriver) &&
        (!filters.bestCar || v.bestCar) &&
        (!filters.bestRating || v.bestRating)
      );

      if (!matchesFilter) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    vehicles.forEach(v => {
      const matchesFilter = (
        (!filters.bestDriver || v.bestDriver) &&
        (!filters.bestCar || v.bestCar) &&
        (!filters.bestRating || v.bestRating)
      );

      if (!matchesFilter) return;

      const title = isFR ? v.nameFR : v.name;
      
      const customIcon = L.divIcon({
        className: 'custom-car-marker',
        html: `
          <div class="car-marker-icon ${selectedVehicleId === v.id ? 'highlighted' : ''}" style="transform: rotate(${v.angle}deg);" title="${title}">
            <span class="material-symbols-outlined" style="font-size: 20px;">directions_car</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      if (markersRef.current[v.id]) {
        // Update existing marker
        markersRef.current[v.id].setLatLng([v.lat, v.lng]);
        markersRef.current[v.id].setIcon(customIcon);
      } else {
        // Create new marker
        const marker = L.marker([v.lat, v.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedVehicleId(v.id);
          onSelectDriver(v);
        });
        markersRef.current[v.id] = marker;
      }
    });

  }, [vehicles, filters, selectedVehicleId, language]);

  // Handle flyTo when vehicle is selected in Sidebar
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVehicleId) return;

    const selectedCar = vehicles.find(v => v.id === selectedVehicleId);
    if (selectedCar) {
      map.panTo([selectedCar.lat, selectedCar.lng]);
      
      // Temporarily flash marker icon
      const marker = markersRef.current[selectedVehicleId];
      if (marker) {
        const el = marker.getElement();
        if (el) {
          const iconEl = el.querySelector('.car-marker-icon');
          if (iconEl) {
            iconEl.classList.add('highlighted');
            setTimeout(() => {
              // Only remove if not the currently active selection
              if (selectedVehicleId !== selectedCar.id) {
                iconEl.classList.remove('highlighted');
              }
            }, 1500);
          }
        }
      }
    }
  }, [selectedVehicleId]);

  // GPS Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => 
        prev.map(v => {
          const latDrift = (Math.random() - 0.5) * 0.0008;
          const lngDrift = (Math.random() - 0.5) * 0.0008;
          const newAngle = (v.angle + Math.floor((Math.random() - 0.5) * 30) + 360) % 360;
          return {
            ...v,
            lat: v.lat + latDrift,
            lng: v.lng + lngDrift,
            angle: newAngle
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleChipClick = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="map-viewport-wrapper">
      {/* Floating Map Filters */}
      <div className="map-filters-overlay">
        <span className="filter-label" id="txtFilterBy">{dict.txtFilterBy}</span>
        <div className="filter-chips">
          <button 
            className={`filter-chip ${filters.bestDriver ? 'active' : ''}`}
            onClick={() => handleChipClick('bestDriver')}
          >
            <span className="material-symbols-outlined icon-chip">star</span>
            <span>{dict.txtBestDriver}</span>
          </button>
          <button 
            className={`filter-chip ${filters.bestCar ? 'active' : ''}`}
            onClick={() => handleChipClick('bestCar')}
          >
            <span className="material-symbols-outlined icon-chip">directions_car</span>
            <span>{dict.txtBestCar}</span>
          </button>
          <button 
            className={`filter-chip ${filters.bestRating ? 'active' : ''}`}
            onClick={() => handleChipClick('bestRating')}
          >
            <span className="material-symbols-outlined icon-chip">thumb_up</span>
            <span>{dict.txtBestRating}</span>
          </button>
        </div>
      </div>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
    </section>
  );
}
