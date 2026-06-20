import { MapPin, Search, Locate } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => resolve(window.google.maps));
    }
  });
};

function MapPicker({ value, onChange }) {
  const [apiKey, setApiKey] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [resolvedAddress, setResolvedAddress] = useState(value || '');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const hasAutoDetectedRef = useRef(false);

  // Reusable geolocation detection function
  const detectLocation = useCallback((force = false) => {
    if (!mapsLoaded || !mapInstanceRef.current) return;
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // If not forced and user has already typed something in the input while we were waiting, don't overwrite it
        if (!force && inputRef.current && inputRef.current.value) {
          setIsLocating(false);
          return;
        }

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          setIsLocating(false);
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            
            // Double check that the user didn't type something during the geocoding request if not forced
            if (!force && inputRef.current && inputRef.current.value) {
              return;
            }

            const emeraldPin = {
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
              fillColor: '#34d399',
              fillOpacity: 1,
              strokeColor: '#0e0e11',
              strokeWeight: 2,
              scale: 1.5,
              anchor: new window.google.maps.Point(12, 22)
            };

            const map = mapInstanceRef.current;
            if (markerRef.current) {
              markerRef.current.setPosition(pos);
            } else {
              markerRef.current = new window.google.maps.Marker({
                position: pos,
                map,
                icon: emeraldPin,
                animation: window.google.maps.Animation.DROP
              });
            }
            map.panTo(pos);
            map.setZoom(15);

            setResolvedAddress(address);
            setInputValue(address);
            onChange(address);
          } else {
            console.error('Geocoder failed:', status);
            setLocationError('Could not resolve your coordinates to an address.');
          }
        });
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        let msg = 'Failed to detect location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access denied.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location info unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location detection timed out.';
        }
        setLocationError(msg);

        // Auto-clear error after 5 seconds to keep UI clean
        setTimeout(() => {
          setLocationError(null);
        }, 5000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [mapsLoaded, onChange]);

  // Load API key from server config
  useEffect(() => {
    let active = true;
    async function fetchConfig() {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (active && data?.data?.googleMapsApiKey) {
          setApiKey(data.data.googleMapsApiKey);
        }
      } catch (err) {
        console.error('Error fetching google maps config:', err);
      }
    }
    fetchConfig();
    return () => {
      active = false;
    };
  }, []);

  // Sync external value
  useEffect(() => {
    if (value !== resolvedAddress) {
      setInputValue(value || '');
      setResolvedAddress(value || '');
    }
  }, [value, resolvedAddress]);

  // Load Google Maps script once API key is available
  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMapsScript(apiKey)
      .then(() => setMapsLoaded(true))
      .catch((err) => console.error('Failed to load Google Maps script:', err));
  }, [apiKey]);

  // Initialize Map and Place Autocomplete
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !inputRef.current) return;

    // Default center (Downtown Austin, TX)
    const defaultCenter = { lat: 30.2672, lng: -97.7431 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1a24' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a24' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#74748b' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#8e8ea8' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6e6e82' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#12251e' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#34d399', opacity: 0.6 }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#242432' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1a1a24' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#74748b' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#2e2e3f' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1a1a24' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#a0a0b8' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0c0c12' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#44445a' }]
        }
      ],
      disableDefaultUI: true,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Custom Emerald green Pin icon
    const emeraldPin = {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: '#34d399',
      fillOpacity: 1,
      strokeColor: '#0e0e11',
      strokeWeight: 2,
      scale: 1.5,
      anchor: new window.google.maps.Point(12, 22)
    };

    // Initialize Autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'formatted_address', 'name']
    });

    autocomplete.bindTo('bounds', map);

    // Marker helper
    const updateMarker = (position, addressName) => {
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position,
          map,
          icon: emeraldPin,
          animation: window.google.maps.Animation.DROP
        });
      }
      map.panTo(position);
      map.setZoom(15);
      
      setResolvedAddress(addressName);
      setInputValue(addressName);
      onChange(addressName);
    };

    // Autocomplete Selection Change Event
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }
      setLocationError(null);
      const position = place.geometry.location;
      const address = place.formatted_address || place.name;
      updateMarker(position, address);
    });

    // Map Click Event to pinpoint spot
    map.addListener('click', (event) => {
      const position = event.latLng;
      const geocoder = new window.google.maps.Geocoder();
      setLocationError(null);

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          updateMarker(position, address);
        } else {
          console.warn('Geocoder failed due to:', status);
        }
      });
    });

    // Initialize marker if value is already present (geocode it to center map)
    if (value) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === 'OK' && results[0]?.geometry?.location) {
          const position = results[0].geometry.location;
          map.setCenter(position);
          markerRef.current = new window.google.maps.Marker({
            position,
            map,
            icon: emeraldPin
          });
        }
      });
    } else {
      // Auto-detect user's location on initial load if no value is set
      if (navigator.geolocation && !hasAutoDetectedRef.current) {
        hasAutoDetectedRef.current = true;
        detectLocation(false);
      }
    }
  }, [mapsLoaded, value, detectLocation]);

  return (
    <div className="map-picker-wrapper">
      <div className="map-search-container">
        <MapPin className="map-search-icon" size={16} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setLocationError(null);
          }}
          placeholder="Search for a location or click on the map below..."
          required
          minLength={2}
          maxLength={180}
        />
        <button
          type="button"
          className={`map-locate-btn ${isLocating ? 'locating' : ''}`}
          onClick={() => detectLocation(true)}
          title="Detect my current location"
          aria-label="Detect my current location"
          disabled={isLocating || !mapsLoaded}
        >
          <Locate size={16} />
        </button>
        <Search className="map-search-end-icon" size={16} aria-hidden="true" />
      </div>

      <div className="map-container-outer">
        <div ref={mapRef} className="map-canvas" />
        {!apiKey && <div className="map-overlay-loading">Loading configuration...</div>}
        {apiKey && !mapsLoaded && <div className="map-overlay-loading">Loading Google Maps...</div>}
      </div>

      {isLocating && (
        <div className="map-resolved-address status-locating">
          <span className="bullet pulsing" />
          Detecting your location...
        </div>
      )}
      {!isLocating && locationError && (
        <div className="map-resolved-address status-error">
          <span className="bullet error" />
          Error: <strong style={{ color: 'var(--red)' }}>{locationError}</strong>
        </div>
      )}
      {!isLocating && !locationError && resolvedAddress && (
        <div className="map-resolved-address">
          <span className="bullet" />
          Selected: <strong>{resolvedAddress}</strong>
        </div>
      )}
    </div>
  );
}

export default MapPicker;
