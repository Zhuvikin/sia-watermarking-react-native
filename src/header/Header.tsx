import logo from '../logo.png';
import React from 'react';

type HeaderProps = {};

export const Header = ({}: HeaderProps) => (
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" /> Watermarking
  </header>
);
