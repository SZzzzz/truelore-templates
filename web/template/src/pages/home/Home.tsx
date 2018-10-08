import React, { Component } from 'react';
import { Rate } from 'antd';
import './Home.scss';
import logo from '../../assets/logo.svg';

export default class Home extends Component {
  render(): JSX.Element {
    return (
      <div className="home">
        <div className="&-header">
          <img src={logo} className="&-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="&-intro">
          To get started, edit <code>src/home.tsx</code> and save to reload.
        </p>
        <Rate character="6"/>
      </div>
    );
  }
};