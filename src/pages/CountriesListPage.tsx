import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  Grid, 
  Typography 
} from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { getAllCountries } from '../services/countriesService';
import { TravelPlan, Country } from '../types';
import axios from 'axios';
import TravelPlanCard from '../components/TravelPlanCard';

interface CountryInfo {
  alpha2Code: string;
  name: string;
}

const UNSPLASH_API_KEY = 'NBf8wjViQ1y1h0e2a7hT9i3e0Go9MHE8m6hk_Fq61Qk'; // Замените на ваш ключ от Unsplash
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

const fetchCountryPhoto = async (countryCode: string): Promise<string> => {
  try {
    const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
      params: {
        query: `${countryCode} landscape`,
        per_page: 1,
        client_id: UNSPLASH_API_KEY,
      },
    });
    return response.data.results[0]?.urls?.regular || 'https://via.placeholder.com/320x140?text=No+Image';
  } catch (error) {
    console.error(`Ошибка при загрузке фото для ${countryCode}:`, error);
    return 'https://via.placeholder.com/320x140?text=No+Image';
  }
};

const CountriesListPage: React.FC = () => {
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [countriesMap, setCountriesMap] = useState<Map<string, CountryInfo>>(new Map());
  const [photoCache, setPhotoCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await getAllCountries();
      const map = new Map<string, CountryInfo>();
      countries.forEach((country: Country) => {
        map.set(country.alpha3Code, { alpha2Code: country.alpha2Code, name: country.name });
      });
      setCountriesMap(map);
    };

    fetchCountries();

    const travelPlansRef = ref(db, 'travelPlans');
    const unsubscribe = onValue(travelPlansRef, async (snapshot) => {
      const data = snapshot.val() as { [key: string]: Omit<TravelPlan, 'id'> } | null;
      const plansList: TravelPlan[] = data 
        ? Object.entries(data).map(([id, plan]) => ({ ...plan, id }))
        : [];

      const updatedPlans = await Promise.all(
        plansList.map(async (plan) => {
          const cachedPhoto = photoCache.get(plan.country);
          if (cachedPhoto) {
            return { ...plan, photoUrl: cachedPhoto };
          }
          const photoUrl = await fetchCountryPhoto(plan.country);
          setPhotoCache(prev => new Map(prev).set(plan.country, photoUrl));
          return { ...plan, photoUrl };
        })
      );

      setTravelPlans(updatedPlans);
      setLoading(false);
    }, (error) => {
      console.error('Ошибка загрузки планов путешествий:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [photoCache]);

  return (
    <Container 
      sx={{ 
        py: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 4, 
          color: '#1976d2', 
          fontWeight: 'bold' 
        }}
      >
        Список планов путешествий
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create"
          sx={{
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
            px: 4,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Добавить план
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : travelPlans.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ textAlign: 'center', color: '#757575' }}
        >
          Пусто
        </Typography>
      ) : (
        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
        >
          {travelPlans.map((plan) => {
            const countryInfo = countriesMap.get(plan.country) || { alpha2Code: 'xx', name: plan.country };
            return (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <TravelPlanCard plan={plan} countryName={countryInfo.name} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default CountriesListPage;