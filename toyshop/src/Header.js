// Snippet: `rafce`
import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import './index.css';

const Header = () => {
  return (
    <div className='login'>
      <form>
        <label>Username: 
          <input type='text' />
        </label>
        <br />
        <label>Password: 
          <input type='password' />
        </label>
        <br />
        <label>Confirm Password: 
          <input type='password' />
        </label>
        <br />
        <Button variant="primary" type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default Header;
