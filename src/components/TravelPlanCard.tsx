import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { TravelPlan } from '../types';

interface TravelPlanCardProps {
  plan: TravelPlan;
  countryName: string;
}

const TravelPlanCard: React.FC<TravelPlanCardProps> = ({ plan, countryName }) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        mx: 'auto', 
        boxShadow: 3, 
        '&:hover': { boxShadow: 6 } 
      }}
    >
      <CardActionArea component={Link} to={`/country/${plan.country}`}>
        <CardMedia
          component="img"
          height="140"
          image={plan.photoUrl || 'https://via.placeholder.com/320x140?text=Loading...'}
          alt={`${countryName} landscape`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div"
            sx={{ 
              color: '#424242', 
              fontWeight: 'medium', 
              textAlign: 'center'
            }}
          >
            {plan.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Страна: {countryName}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Места: {plan.places.length > 0 ? plan.places.slice(0, 2).join(', ') + (plan.places.length > 2 ? '...' : '') : 'Не указаны'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TravelPlanCard;