import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container 
} from '@mui/material';
import { getCountryByCode } from '../services/countriesService';
import { ref, onValue, remove } from 'firebase/database'; 
import { db } from '../firebase/config';
import { Country, TravelPlan } from '../types';

const CountryDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const [countryData, setCountryData] = useState<Country | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      if (code) {
        const data = await getCountryByCode(code);
        setCountryData(data);
      }
    };
    fetchCountryData();
  }, [code]);

  useEffect(() => {
    if (code) {
      const travelPlansRef = ref(db, 'travelPlans');
      const unsubscribe = onValue(travelPlansRef, (snapshot) => {
        const data = snapshot.val() as { [key: string]: TravelPlan } | null;
        if (data) {
          const planEntry = Object.entries(data).find(([_, item]) => item.country === code);
          if (planEntry) {
            const [id, planData] = planEntry;
            setPlanId(id);
            setPlan(planData);
          } else {
            setPlan(null);
            setPlanId(null);
          }
        } else {
          setPlan(null);
          setPlanId(null);
        }
      });
      return () => unsubscribe();
    }
  }, [code]);

  const handleDelete = async () => {
    if (planId) {
      try {
        const planRef = ref(db, `travelPlans/${planId}`);
        await remove(planRef);
        navigate('/');
      } catch (error) {
        console.error('Ошибка при удалении плана:', error);
      }
    }
  };

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          boxShadow: 3,
          p: 2,
        }}
      >
        <CardContent>
          {countryData ? (
            <>
              <Typography variant="h4" align="center" gutterBottom>
                {countryData.name}
              </Typography>
              <Typography variant="body1" align="center">
                Столица: {countryData.capital || 'Не указана'}
              </Typography>
              <Typography variant="body1" align="center">
                Регион: {countryData.region || 'Не указан'}
              </Typography>
              <Typography variant="body1" align="center">
                Население: {countryData.population || 'Не указано'}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" align="center">
              Загрузка...
            </Typography>
          )}

          {plan && (
            <>
              <Typography variant="h5" align="center" sx={{ mt: 2 }}>
                Места, которые следует посетить:
              </Typography>
              <Typography variant="body1" align="center">
                {plan.places.join(', ')}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/edit/${planId}`}
                  disabled={!planId}
                >
                  Редактировать
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/"
                >
                  Назад
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={!planId}
                >
                  Удалить
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CountryDetailPage;