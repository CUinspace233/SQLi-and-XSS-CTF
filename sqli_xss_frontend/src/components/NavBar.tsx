import { AppBar, Box, Toolbar, Container } from '@mui/material';
import Button from '@mui/joy/Button';
import { Link, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

const pages = ['Home', 'Blanko', 'Slido', 'Tetro'];
const pageRoutes = {
  Home: '/',
  Blanko: '/blanko',
  Slido: '/slido',
  Tetro: '/tetro',
};

const navItemDict = {
  Home: 'H',
  Blanko: 'B',
  Slido: 'S',
  Tetro: 'T',
};

export default function NavBar() {
  const location = useLocation();
  const isMobileHeader = useMediaQuery('(max-width:800px)');

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: '#eeeeee' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://images.credly.com/images/0a6743b4-cec3-469a-bd76-8ca923841b7d/blob.png"
                alt="Website Logo"
                width={50}
                height={50}
                style={{ margin: 15 }}
              />
            </Link>
          </Box>

          {/* Desktop Navigation or Mobile Navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              height: 80,
              justifyContent: 'flex-end',
            }}
          >
            {pages.map((page) => {
              const isActive = location.pathname === pageRoutes[page as keyof typeof pageRoutes];
              return (
                <Button
                  aria-label={page}
                  key={page}
                  component={Link}
                  to={pageRoutes[page as keyof typeof pageRoutes]}
                  variant="plain"
                  color={isActive ? 'primary' : 'neutral'}
                  size="lg"
                >
                  {isMobileHeader ? navItemDict[page as keyof typeof navItemDict] : page}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
