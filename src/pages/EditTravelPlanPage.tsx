import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton, 
  Typography,
  InputAdornment,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase/config';
import { getAllCountries } from '../services/countriesService';
import { TravelPlan, Country } from '../types';

const EditTravelPlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Загрузка списка стран и данных плана
  useEffect(() => {
    const fetchCountries = async () => {
      const countriesData = await getAllCountries();
      setCountries(countriesData);
      setFilteredCountries(countriesData);
    };

    const fetchPlan = () => {
      if (id) {
        const planRef = ref(db, `travelPlans/${id}`);
        const unsubscribe = onValue(planRef, (snapshot) => {
          const data = snapshot.val() as Omit<TravelPlan, 'id'> | null;
          if (data) {
            setPlan({ ...data, id });
          } else {
            setPlan(null);
          }
        });
        return () => unsubscribe();
      }
    };

    fetchCountries();
    fetchPlan();
  }, [id]);

  // Фильтрация стран по поисковому запросу
  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  // Обработчики изменений
  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    if (plan) {
      setPlan({ ...plan, country: event.target.value as string });
      setOpen(false);
    }
  };

  const handlePlaceChange = (index: number, value: string) => {
    if (plan) {
      const newPlaces = [...plan.places];
      newPlaces[index] = value;
      setPlan({ ...plan, places: newPlaces });
    }
  };

  const handleAddPlace = () => {
    if (plan) {
      setPlan({ ...plan, places: [...plan.places, ''] });
    }
  };

  const handleRemovePlace = (index: number) => {
    if (plan && plan.places.length > 1) {
      const newPlaces = plan.places.filter((_, i) => i !== index);
      setPlan({ ...plan, places: newPlaces });
    }
  };

  const handleSubmit = async () => {
    if (plan && id && plan.name && plan.country && plan.places.every(place => place.trim())) {
      try {
        const planRef = ref(db, `travelPlans/${id}`);
        await set(planRef, {
          name: plan.name,
          country: plan.country,
          places: plan.places,
        });
        navigate(`/country/${plan.country}`);
      } catch (error) {
        console.error('Ошибка при обновлении плана:', error);
      }
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  // Обработчик ввода в поле поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Открытие/закрытие Select
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!plan) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Редактировать план путешествия
      </Typography>

      <TextField
        label="Название плана"
        value={plan.name}
        onChange={(e) => setPlan({ ...plan, name: e.target.value })}
        fullWidth
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Выберите страну</InputLabel>
        <Select
          value={plan.country}
          onChange={handleCountryChange}
          label="Выберите страну"
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
        >
          <TextField
            placeholder="Поиск страны..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            sx={{ p: 1 }}
            inputRef={searchInputRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <MenuItem key={country.alpha3Code} value={country.alpha3Code}>
                {country.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Нет совпадений</MenuItem>
          )}
        </Select>
      </FormControl>

      {plan.places.map((place, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label={`Место ${index + 1}`}
            value={place}
            onChange={(e) => handlePlaceChange(index, e.target.value)}
            fullWidth
            sx={{ mr: 1 }}
          />
          <IconButton
            onClick={handleAddPlace}
            color="primary"
            disabled={index !== plan.places.length - 1}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => handleRemovePlace(index)}
            color="error"
            disabled={plan.places.length === 1}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Сохранить
      </Button>
    </Box>
  );
};

export default EditTravelPlanPage;