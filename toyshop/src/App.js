import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

function App() {
  const [data, setData] = useState([]);  
  const [searchQuery, setSearchQuery] = useState('');  
  const [filteredData, setFilteredData] = useState([]); 
  const [cartItems, setCartItems] = useState([]); 
  const [showCart, setShowCart] = useState(false); 

  useEffect(() => {
    fetch('http://localhost:3001/data') 
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/product?product_name=${searchQuery}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Product not found');
        }
        return response.json();
      })
      .then(product => {
        setFilteredData([product]);  // Ensure product is an array for mapping
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setFilteredData([]); 
      });
  };

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Toy Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Details</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}> {/* Fixed inline issue */}
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-sm-2"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" variant="outline-success">Search</Button>
              </Col>
              <Col xs="auto">
                <Button variant="light" onClick={handleShowCart}>Cart ({cartItems.length})</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Navbar>

      <br />
      <div className='toy'>
        {(filteredData.length > 0 ? filteredData : data).map(item => (  
          <Card key={item.product_id} style={{ width: '18rem' }} onClick={() => handleAddToCart(item)}>
            <Card.Img variant="top" src={item.image_url} />
            <Card.Body>
              <Card.Title>{item.product_name}</Card.Title>
              <Card.Text>{item.description}</Card.Text>
              <Row>
                <Col xs="auto">
                  <Button variant="primary">Buy now</Button>
                </Col>
                <Col xs="auto">
                  <Button variant="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>Add to cart</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
      <br />

      <Modal show={showCart} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>Cart Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>{item.product_name} - ${item.price}</li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCart}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseCart}>
            Proceed to Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
