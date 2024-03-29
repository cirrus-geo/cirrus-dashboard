import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container>
        <p className="header-title">
          <Link to="/">FilmDrop</Link>
        </p>
      </Container>
    </header>
  );
};

export default Header;