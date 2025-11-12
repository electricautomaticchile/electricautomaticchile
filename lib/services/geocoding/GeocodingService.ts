import {
    Coordinates,
    Address,
    GeocodingResult,
    ReverseGeocodingResult,
    GeocodingConfig
} from './types';

export class GeocodingService {
    private config: GeocodingConfig;
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

    constructor(config: GeocodingConfig) {
        this.config = config;
    }

    /**
     * Geocodifica una dirección usando Google Maps API
     */
    async geocodeAddress(address: string): Promise<GeocodingResult[]> {
        const cacheKey = `geocode_${address}`;
        const cached = this.getCachedData(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            // Intentar primero con Google Maps
            let results = await this.geocodeWithGoogle(address);

            // Si no hay resultados, intentar con Nominatim
            if (results.length === 0) {
                results = await this.geocodeWithNominatim(address);
            }

            this.setCachedData(cacheKey, results);
            return results;
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw new Error('Failed to geocode address');
        }
    }

    /**
     * Geocodificación inversa usando coordenadas
     */
    async reverseGeocode(coordinates: Coordinates): Promise<ReverseGeocodingResult[]> {
        const cacheKey = `reverse_${coordinates.lat}_${coordinates.lng}`;
        const cached = this.getCachedData(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            // Intentar primero con Google Maps
            let results = await this.reverseGeocodeWithGoogle(coordinates);

            // Si no hay resultados, intentar con Nominatim
            if (results.length === 0) {
                results = await this.reverseGeocodeWithNominatim(coordinates);
            }

            this.setCachedData(cacheKey, results);
            return results;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            throw new Error('Failed to reverse geocode coordinates');
        }
    }

    /**
     * Geocodificación con Google Maps API
     */
    private async geocodeWithGoogle(address: string): Promise<GeocodingResult[]> {
        if (!this.config.googleMapsApiKey) {
            return [];
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.config.googleMapsApiKey}&language=${this.config.defaultLanguage}&region=${this.config.defaultCountry}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Geocoding API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'OK') {
            if (data.status === 'ZERO_RESULTS') {
                return [];
            }
            throw new Error(`Google Geocoding API error: ${data.status}`);
        }

        return data.results.map((result: any) => this.transformGoogleResult(result));
    }

    /**
     * Geocodificación con Nominatim (OpenStreetMap)
     */
    private async geocodeWithNominatim(address: string): Promise<GeocodingResult[]> {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=5&countrycodes=${this.config.defaultCountry.toLowerCase()}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': this.config.nominatimUserAgent
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status}`);
        }

        const data = await response.json();
        return data.map((result: any) => this.transformNominatimResult(result));
    }

    /**
     * Geocodificación inversa con Google Maps
     */
    private async reverseGeocodeWithGoogle(coordinates: Coordinates): Promise<ReverseGeocodingResult[]> {
        if (!this.config.googleMapsApiKey) {
            return [];
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${this.config.googleMapsApiKey}&language=${this.config.defaultLanguage}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google Reverse Geocoding API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'OK') {
            if (data.status === 'ZERO_RESULTS') {
                return [];
            }
            throw new Error(`Google Reverse Geocoding API error: ${data.status}`);
        }

        return data.results.map((result: any) => this.transformGoogleReverseResult(result));
    }

    /**
     * Geocodificación inversa con Nominatim
     */
    private async reverseGeocodeWithNominatim(coordinates: Coordinates): Promise<ReverseGeocodingResult[]> {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&addressdetails=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': this.config.nominatimUserAgent
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim Reverse API error: ${response.status}`);
        }

        const data = await response.json();
        return [this.transformNominatimReverseResult(data)];
    }

    /**
     * Transforma resultado de Google Maps
     */
    private transformGoogleResult(result: any): GeocodingResult {
        const location = result.geometry.location;
        const addressComponents = result.address_components;

        const address: Address = {
            street: this.getAddressComponent(addressComponents, 'route') || '',
            number: this.getAddressComponent(addressComponents, 'street_number'),
            city: this.getAddressComponent(addressComponents, 'locality') ||
                this.getAddressComponent(addressComponents, 'administrative_area_level_2') || '',
            state: this.getAddressComponent(addressComponents, 'administrative_area_level_1') || '',
            country: this.getAddressComponent(addressComponents, 'country') || '',
            postalCode: this.getAddressComponent(addressComponents, 'postal_code'),
            formattedAddress: result.formatted_address
        };

        return {
            coordinates: { lat: location.lat, lng: location.lng },
            address,
            accuracy: result.geometry.location_type as any,
            placeId: result.place_id,
            types: result.types
        };
    }

    /**
     * Transforma resultado de Nominatim
     */
    private transformNominatimResult(result: any): GeocodingResult {
        const address: Address = {
            street: result.address?.road || '',
            number: result.address?.house_number,
            city: result.address?.city || result.address?.town || result.address?.village || '',
            state: result.address?.state || '',
            country: result.address?.country || '',
            postalCode: result.address?.postcode,
            formattedAddress: result.display_name
        };

        return {
            coordinates: { lat: parseFloat(result.lat), lng: parseFloat(result.lon) },
            address,
            accuracy: 'APPROXIMATE',
            types: [result.type]
        };
    }

    /**
     * Transforma resultado de geocodificación inversa de Google
     */
    private transformGoogleReverseResult(result: any): ReverseGeocodingResult {
        const addressComponents = result.address_components;

        const address: Address = {
            street: this.getAddressComponent(addressComponents, 'route') || '',
            number: this.getAddressComponent(addressComponents, 'street_number'),
            city: this.getAddressComponent(addressComponents, 'locality') ||
                this.getAddressComponent(addressComponents, 'administrative_area_level_2') || '',
            state: this.getAddressComponent(addressComponents, 'administrative_area_level_1') || '',
            country: this.getAddressComponent(addressComponents, 'country') || '',
            postalCode: this.getAddressComponent(addressComponents, 'postal_code'),
            formattedAddress: result.formatted_address
        };

        return {
            address,
            placeId: result.place_id,
            types: result.types
        };
    }

    /**
     * Transforma resultado de geocodificación inversa de Nominatim
     */
    private transformNominatimReverseResult(result: any): ReverseGeocodingResult {
        const address: Address = {
            street: result.address?.road || '',
            number: result.address?.house_number,
            city: result.address?.city || result.address?.town || result.address?.village || '',
            state: result.address?.state || '',
            country: result.address?.country || '',
            postalCode: result.address?.postcode,
            formattedAddress: result.display_name
        };

        return {
            address,
            types: [result.type]
        };
    }

    /**
     * Obtiene componente de dirección de Google Maps
     */
    private getAddressComponent(components: any[], type: string): string | undefined {
        const component = components.find(comp => comp.types.includes(type));
        return component?.long_name;
    }

    /**
     * Calcula distancia entre dos coordenadas (fórmula de Haversine)
     */
    calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
        const R = 6371000; // Radio de la Tierra en metros
        const dLat = this.toRadians(coord2.lat - coord1.lat);
        const dLng = this.toRadians(coord2.lng - coord1.lng);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Convierte grados a radianes
     */
    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Valida si las coordenadas están dentro de Chile
     */
    isWithinChile(coordinates: Coordinates): boolean {
        // Límites aproximados de Chile
        const chileBounds = {
            north: -17.5,
            south: -56.0,
            east: -66.0,
            west: -75.0
        };

        return coordinates.lat >= chileBounds.south &&
            coordinates.lat <= chileBounds.north &&
            coordinates.lng >= chileBounds.west &&
            coordinates.lng <= chileBounds.east;
    }

    /**
     * Obtiene URL de Street View
     */
    getStreetViewUrl(coordinates: Coordinates, heading: number = 0, pitch: number = 0): string {
        if (!this.config.googleMapsApiKey) {
            return '';
        }

        return `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${coordinates.lat},${coordinates.lng}&heading=${heading}&pitch=${pitch}&key=${this.config.googleMapsApiKey}`;
    }

    /**
     * Obtiene URL de imagen satelital
     */
    getSatelliteImageUrl(coordinates: Coordinates, zoom: number = 18): string {
        if (!this.config.googleMapsApiKey) {
            return '';
        }

        return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=${zoom}&size=640x640&maptype=satellite&key=${this.config.googleMapsApiKey}`;
    }

    /**
     * Obtiene datos del cache
     */
    private getCachedData(key: string): any | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    /**
     * Guarda datos en cache
     */
    private setCachedData(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Limpia cache expirado
     */
    public clearExpiredCache(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];
        
        this.cache.forEach((cached, key) => {
            if (now - cached.timestamp >= this.CACHE_DURATION) {
                keysToDelete.push(key);
            }
        });
        
        keysToDelete.forEach(key => this.cache.delete(key));
    }
}