import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { loginAttempt } from '../services/api';
import DeliveryContext from '../context/DeliveryContext';
import './styles/Login.css';
import logo from '../images/logo-drink.gif';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState(true);
  const [errorPassword, setErrorPassword] = useState(true);
  const [failedLogin, setFailedLogin] = useState(false);
  const { setLocalStorage } = useContext(DeliveryContext);

  const history = useHistory();

  useEffect(() => {
    const getUserInfo = () => {
      if (localStorage.getItem('user')) {
        const { role } = JSON.parse(localStorage.getItem('user'));
        if (role === 'customer') {
          return history.push('/customer/products');
        }
      }
    };
    getUserInfo();
  }, [history]);

  const emailValidation = (value) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return !regex.test(value);
  };

  const passwordValidation = (value) => {
    const minLength = 6;
    return (value.length < minLength);
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <img
          src={ logo }
          alt="app-logo"
          className="logo"
          data-testid="login_logo"
        />
        <h1
          className="login_title"
          data-testid="login_title"
        >
          Maria Delivery
        </h1>
        <form>
          <input
            type="email"
            id="inputEmail"
            placeholder="Usuário"
            data-testid="common_login__input-email"
            value={ email }
            onChange={ ({ target: { value } }) => {
              setEmail(value);
              setErrorEmail(emailValidation(value));
            } }
          />
          <input
            type="password"
            id="inputPassword"
            placeholder="Senha"
            data-testid="common_login__input-password"
            value={ password }
            onChange={ ({ target: { value } }) => {
              setPassword(value);
              setErrorPassword(passwordValidation(value));
            } }
          />
          {!!((errorEmail || errorPassword))
        && (email.length > 0 || password.length > 0)
        && (
          <p
            className="login-alert"
            data-testid="login__input_invalid_login_alert"
          >
            Please, provide a valid email and password
          </p>)}

          <button
            type="button"
            data-testid="common_login__button-login"
            disabled={ !!((errorEmail || errorPassword)) }
            onClick={ async () => {
              try {
                const user = await loginAttempt({ email, password });
                setLocalStorage('user', user);
                if (user.role === 'seller') {
                  return history.push('/seller/orders');
                }
                if (user.role === 'administrator') {
                  return history.push('/admin/manage');
                }
                return history.push('/customer/products');
              } catch (error) {
              // console.log(error);
                setFailedLogin(true);
              }
            } }
          >
            Entrar
          </button>

          <Link to="/register">
            <button
              type="button"
              data-testid="common_login__button-register"
            >
              Registre-se
            </button>
          </Link>
        </form>
        { failedLogin && (
          <p
            className="login-alert"
            data-testid="common_login__element-invalid-email"
          >
            Erro! Usuário não encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
