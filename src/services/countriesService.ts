import axios from 'axios';
import { Country } from '../types';

export const getAllCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>('https://restcountries.com/v2/all?fields=alpha3Code,alpha2Code,name');
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке стран:', error);
    return [];
  }
};

export const getCountryByCode = async (code: string): Promise<Country | null> => {
  try {
    const response = await axios.get<Country>(`https://restcountries.com/v2/alpha/${code}`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных страны:', error);
    return null;
  }
};