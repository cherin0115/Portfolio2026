
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

export interface CityData {
  name: string;
  coords: string;
  altitude: number;
  temperature: string;
  accent: string;
}

export enum JourneyStop {
  VIRGINIA = 'RICHMOND',
  SEOUL = 'SEOUL',
  LA = 'LA'
}
