import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import NavBar from '../components/NavBar';
import OrderCard from '../components/OrderCard';
import api from '../services/api';
import './styles/Orders.css';

export default function Orders() {
  const [customerOrder, setCustomerOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [idUser, setIdUser] = useState();
  const [userToken, setUserToken] = useState();

  useEffect(() => {
    const getUserInfo = () => {
      if (!localStorage.getItem('user')) {
        return history.push('/login');
      }
      const { id, token } = JSON.parse(localStorage.getItem('user'));
      setIdUser(id);
      setUserToken(token);
      return token;
    };
    const fetchCustomerOrders = async (token, value) => {
      const url = 'http://www.localhost:3001/customer/orders';
      const header = { headers: { Authorization: `${token}` } };
      const { data } = await api.get(url, header);
      const orderByUserId = data.filter((order) => order.userId === value);
      setCustomerOrder(orderByUserId);
    };
    const token = getUserInfo();
    fetchCustomerOrders(token, idUser); // colocar ID do usuário de forma dinamica
    setLoading(false);
  }, [idUser, history, userToken]);

  return (
    <>
      { !loading && <NavBar />}
      <div className="orders-background">
        { !loading
      && customerOrder.map(({ id, userId, status, saleDate, totalPrice }, index) => (
        <OrderCard
          key={ id }
          saleId={ id }
          userId={ userId }
          order={ `${index + 1}` }
          status={ status }
          saleDate={ saleDate }
          totalPrice={ totalPrice }
        />
      ))}
      </div>
    </>
  );
}
