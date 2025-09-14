import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { UserWell, wellTypes, UserBooster } from "@/hooks/useGameData";
import { WellInfoModal } from './WellInfoModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WellsMapProps {
  wells: UserWell[];
  getWellIcon: (wellType: string) => JSX.Element;
  getRarityColor: (rarity: string) => string;
  calculateProfitMetrics: (dailyIncome: number, price: number) => { 
    monthlyIncome: number; 
    yearlyIncome: number; 
    yearlyPercent: number; 
  };
  formatProfitPercent: (percent: number) => string;
  boosters: UserBooster[];
  getActiveBoosterMultiplier: () => number;
  onUpgradeWell: (wellId: string) => void;
  profile: any;
}

export const WellsMap = ({ 
  wells, 
  getWellIcon, 
  getRarityColor, 
  calculateProfitMetrics, 
  formatProfitPercent, 
  boosters, 
  getActiveBoosterMultiplier,
  onUpgradeWell,
  profile 
}: WellsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedWell, setSelectedWell] = useState<UserWell | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSet, setTokenSet] = useState(false);

  // Check if we have a valid mapbox token
  const handleTokenSubmit = () => {
    if (mapboxToken.startsWith('pk.')) {
      setTokenSet(true);
      localStorage.setItem('mapbox_token', mapboxToken);
    }
  };

  useEffect(() => {
    // Try to load token from localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken && savedToken.startsWith('pk.')) {
      setMapboxToken(savedToken);
      setTokenSet(true);
    }
  }, []);

  // Show token input if not set
  if (!tokenSet) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Настройка карты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Для отображения карты нужен Mapbox токен. Получите бесплатный токен на{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              mapbox.com
            </a>
          </p>
          <div className="space-y-2">
            <Input
              placeholder="pk.eyJ1IjoiY..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={handleTokenSubmit} disabled={!mapboxToken.startsWith('pk.')}>
              Активировать карту
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with satellite view for oil fields
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [55.7558, 37.6173], // Moscow area for oil fields
      zoom: 6,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, []);

  // Generate realistic positions for oil wells around Russia
  const generateWellPosition = (index: number, total: number) => {
    const oilRegions = [
      { lat: 61.2401, lng: 73.3962 }, // Surgut
      { lat: 60.9710, lng: 76.6068 }, // Nizhnevartovsk  
      { lat: 55.7558, lng: 37.6173 }, // Moscow region
      { lat: 56.8431, lng: 60.6454 }, // Yekaterinburg
      { lat: 55.0415, lng: 82.9346 }, // Novosibirsk
    ];
    
    const baseRegion = oilRegions[index % oilRegions.length];
    
    // Add some randomization within the region
    const latOffset = (Math.random() - 0.5) * 2;
    const lngOffset = (Math.random() - 0.5) * 4;
    
    return {
      lat: baseRegion.lat + latOffset,
      lng: baseRegion.lng + lngOffset
    };
  };

  useEffect(() => {
    if (!map.current || wells.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each well
    wells.forEach((well, index) => {
      const wellType = wellTypes.find(wt => wt.name === well.well_type);
      if (!wellType) return;

      const position = generateWellPosition(index, wells.length);
      const boosterMultiplier = getActiveBoosterMultiplier();
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'well-marker';
      markerEl.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        border: 3px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: transform 0.2s;
      `;
      
      // Add rarity-based styling
      const rarityColors = {
        'Обычный': '#6b7280',
        'Редкий': '#3b82f6', 
        'Эпический': '#8b5cf6',
        'Легендарный': '#f59e0b'
      };
      
      const rarityColor = rarityColors[wellType.rarity as keyof typeof rarityColors] || '#6b7280';
      markerEl.style.background = `linear-gradient(135deg, ${rarityColor}, ${rarityColor}dd)`;
      
      // Add oil derrick emoji
      markerEl.innerHTML = '🛢️';
      
      // Hover effects
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.1)';
      });
      
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([position.lng, position.lat])
        .addTo(map.current!);

      // Add click event to show well info
      markerEl.addEventListener('click', () => {
        setSelectedWell(well);
      });

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -50]
      }).setHTML(`
        <div class="p-2 text-sm">
          <div class="font-bold text-white">${wellType.name}</div>
          <div class="text-gray-300">Уровень ${well.level}</div>
          <div class="text-yellow-300">${Math.round(well.daily_income * boosterMultiplier).toLocaleString()} OC/день</div>
          <div class="text-xs text-gray-400 mt-1">Кликните для подробностей</div>
        </div>
      `);

      markerEl.addEventListener('mouseenter', () => {
        popup.setLngLat([position.lng, position.lat]).addTo(map.current!);
      });

      markerEl.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markers.current.push(marker);
    });

    // Fit map to show all wells
    if (wells.length > 0) {
      const coordinates = wells.map((_, index) => {
        const pos = generateWellPosition(index, wells.length);
        return [pos.lng, pos.lat] as [number, number];
      });

      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [wells, getActiveBoosterMultiplier]);

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          🗺️ Ваши нефтяные месторождения на карте
        </p>
        <p className="text-xs text-muted-foreground">
          Кликните на скважину для подробной информации
        </p>
      </div>
      
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden border shadow-lg">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/5" />
      </div>

      {selectedWell && (
        <WellInfoModal
          well={selectedWell}
          wellType={wellTypes.find(wt => wt.name === selectedWell.well_type)!}
          isOpen={!!selectedWell}
          onClose={() => setSelectedWell(null)}
          onUpgrade={onUpgradeWell}
          profile={profile}
          getWellIcon={getWellIcon}
          getRarityColor={getRarityColor}
          calculateProfitMetrics={calculateProfitMetrics}
          formatProfitPercent={formatProfitPercent}
          boosters={boosters}
          getActiveBoosterMultiplier={getActiveBoosterMultiplier}
        />
      )}
    </div>
  );
};