import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Chip, useTheme, CircularProgress } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NatureIcon from '@mui/icons-material/Nature';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapComponentProps {
  parkData: any;
  selectedParkId: string | null;
  onParkSelect: (parkId: string | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  parkData,
  selectedParkId,
  onParkSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const parkLayersRef = useRef<L.GeoJSON[]>([]);
  const theme = useTheme();
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapId] = useState(() => `map-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Use a small timeout to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      // Clean up any existing map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
        mapInstanceRef.current = null;
      }

      // Clear the map container's innerHTML to ensure clean state
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        // Remove any Leaflet classes that might persist
        mapRef.current.className = '';
        // Remove the _leaflet_id property that Leaflet adds
        delete (mapRef.current as any)._leaflet_id;
      }

      // Get user's current location
      const initializeMap = (lat: number, lng: number) => {
        if (!mapRef.current || mapInstanceRef.current) return;

        try {
          mapInstanceRef.current = L.map(mapRef.current, {
            center: [lat, lng],
            zoom: 11,
            zoomControl: true,
          });
        } catch (error) {
          console.error('Error initializing map:', error);
          // If initialization fails, clear the container and try again
          if (mapRef.current) {
            mapRef.current.innerHTML = '';
            mapRef.current.className = '';
            delete (mapRef.current as any)._leaflet_id;
          }
          return;
        }

      // Add tile layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add user location marker
      L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup('Your Location')
        .openPopup();

      // Custom control for map info
      const InfoControl = L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'info-control');
          div.style.background = 'rgba(255,255,255,0.9)';
          div.style.padding = '10px';
          div.style.borderRadius = '8px';
          div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          div.style.fontFamily = 'Roboto, Arial, sans-serif';
          div.style.fontSize = '12px';
          div.innerHTML = '<strong>CityRoots Map</strong><br/>Click on parks to select them';
          return div;
        },
        onRemove: function() {}
      });

      const infoControl = new InfoControl({ position: 'topright' });
      infoControl.addTo(mapInstanceRef.current);
    };

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoadingLocation(false);
          initializeMap(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          setIsLoadingLocation(false);
          // Fallback to default location (Austin, TX)
          initializeMap(30.2672, -97.7431);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
        // Fallback to default location
        initializeMap(30.2672, -97.7431);
      }
    }, 100); // 100ms delay

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.log('Map cleanup error:', e);
        }
        mapInstanceRef.current = null;
      }
      // Also clear the container on cleanup
      const mapElement = mapRef.current;
      if (mapElement) {
        mapElement.innerHTML = '';
        mapElement.className = '';
        delete (mapElement as any)._leaflet_id;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !parkData) return;

    // Clear existing park layers
    parkLayersRef.current.forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer);
    });
    parkLayersRef.current = [];

    if (parkData.features && parkData.features.length > 0) {
      // Process the park data to parse geometry strings
      const processedFeatures = parkData.features.map((feature: any) => ({
        ...feature,
        geometry: typeof feature.geometry === 'string'
          ? JSON.parse(feature.geometry)
          : feature.geometry
      }));

      const processedParkData = {
        ...parkData,
        features: processedFeatures
      };

      // Add new park layers
      const geoJsonLayer = L.geoJSON(processedParkData, {
        style: (feature) => {
          const isSelected = feature?.properties?.Park_id === selectedParkId;
          return {
            fillColor: isSelected ? '#2196F3' : '#66FF66',
            weight: isSelected ? 3 : 2,
            opacity: 1,
            color: isSelected ? '#1976D2' : '#4CAF50',
            dashArray: '',
            fillOpacity: isSelected ? 0.8 : 0.6,
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          const isSelected = props.Park_id === selectedParkId;

          // Tooltip content (shown on hover)
          const tooltipContent = `
            <div style="font-family: Roboto, Arial, sans-serif; min-width: 220px; color: #333;">
              <h4 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: 600;">
                Name: ${props.Park_Name || 'Unnamed Park'}
              </h4>
              <p style="margin: 2px 0; font-size: 12px; color: #555;">
                <strong>Address:</strong> ${props.Park_Addre || 'N/A'}
              </p>
              <p style="margin: 2px 0; font-size: 12px; color: #555;">
                <strong>Owner:</strong> ${props.Park_Owner || 'N/A'}
              </p>
              <p style="margin: 2px 0; font-size: 12px; color: #555;">
                <strong>Zip Code:</strong> ${props.Park_Zip || 'N/A'}
              </p>
            </div>
          `;

          // Popup content (shown on click)
          const popupContent = `
            <div style="font-family: Roboto, Arial, sans-serif; max-width: 280px;">
              <h4 style="margin: 0 0 12px 0; color: ${theme.palette.primary.main}; font-size: 16px;">
                ${props.Park_Name || 'Unnamed Park'}
              </h4>
              <div style="background: #f8f9fa; padding: 8px; border-radius: 6px; margin-bottom: 10px;">
                <p style="margin: 4px 0; font-size: 13px;">
                  <strong>📍 Address:</strong> ${props.Park_Addre || 'N/A'}
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                  <strong>🏛️ Owner:</strong> ${props.Park_Owner || 'N/A'}
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                  <strong>📏 Size:</strong> ${props.Park_Size_Acres ? `${props.Park_Size_Acres.toFixed(2)} acres` : 'N/A'}
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                  <strong>📮 Zip:</strong> ${props.Park_Zip || 'N/A'}
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                  <strong>🆔 Park ID:</strong> ${props.Park_id || 'N/A'}
                </p>
              </div>
              <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center;">
                ${isSelected
                  ? '<span style="color: #4caf50; font-weight: 500;">✓ Selected Park</span>'
                  : '<small style="color: #666;">Click to select this park for queries</small>'
                }
              </div>
            </div>
          `;

          // Bind both tooltip and popup
          layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'right',
            offset: [15, 0],
            className: 'park-tooltip',
            sticky: true
          });

          layer.bindPopup(popupContent);

          layer.on('click', () => {
            onParkSelect(props.Park_id);
            layer.openPopup();

            // Update popup content immediately after selection
            setTimeout(() => {
              layer.setPopupContent(popupContent.replace(
                '<small style="color: #666;">Click to select this park for queries</small>',
                '<span style="color: #4caf50; font-weight: 500;">✓ Selected Park</span>'
              ));
            }, 100);
          });

          layer.on('mouseover', () => {
            if ('setStyle' in layer) {
              (layer as L.Path).setStyle({
                weight: 3,
                fillOpacity: 0.8,
              });
            }
          });

          layer.on('mouseout', () => {
            const isSelected = props.Park_id === selectedParkId;
            if ('setStyle' in layer) {
              (layer as L.Path).setStyle({
                weight: isSelected ? 3 : 2,
                fillOpacity: isSelected ? 0.8 : 0.6,
              });
            }
          });
        },
      });

      geoJsonLayer.addTo(mapInstanceRef.current);
      parkLayersRef.current.push(geoJsonLayer);

      // Fit map to show all parks
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [parkData, selectedParkId, onParkSelect, theme]);

  const parkCount = parkData?.features?.length || 0;

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {parkCount > 0 && (
          <Chip
            icon={<NatureIcon />}
            label={`${parkCount} park${parkCount !== 1 ? 's' : ''} shown`}
            variant="filled"
            sx={{
              bgcolor: 'rgba(46, 125, 50, 0.9)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        )}
        {selectedParkId && (
          <Chip
            icon={<LocationOnIcon />}
            label="Park Selected"
            variant="filled"
            color="secondary"
            sx={{ fontWeight: 500 }}
          />
        )}
        {userLocation && (
          <Chip
            icon={<LocationOnIcon />}
            label="Your Location"
            variant="outlined"
            sx={{
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              borderColor: theme.palette.info.main,
              color: theme.palette.info.main,
              fontWeight: 500,
            }}
          />
        )}
      </Box>

      <div
        ref={mapRef}
        id={mapId}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 0,
        }}
      />

      {isLoadingLocation && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1000,
            bgcolor: 'rgba(255,255,255,0.95)',
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            Getting Your Location
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please allow location access for a better experience
          </Typography>
        </Box>
      )}

      {!isLoadingLocation && parkCount === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1000,
            bgcolor: 'rgba(255,255,255,0.95)',
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <NatureIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            Welcome to CityRoots
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for parks using the chat interface
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;