import React from 'react';
import { Typography, Container } from '@mui/material';

const UnauthorizedPage = () => {
  return (
    <Container>
      <Typography variant="h4" color="error" gutterBottom>Accès refusé</Typography>
      <Typography>Vous n’avez pas l’autorisation d’accéder à cette page.</Typography>
    </Container>
  );
};

export default UnauthorizedPage;
