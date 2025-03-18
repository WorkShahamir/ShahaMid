export interface TravelPlan {
    id: string;
    name: string;
    country: string; 
    places: string[];
    photoUrl?: string;
  }
  
  export interface Country {
    alpha3Code: string;
    alpha2Code: string;
    name: string;
    capital?: string;
    region?: string;
    population?: number;
  }