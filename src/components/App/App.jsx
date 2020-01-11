import React from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';

import './App.css';

class App extends React.Component {
  state = { isToggleOn: false };

  handleOnSuccess = (token, metadata) => {
    // send token to client server
    axios.post('http://localhost:5000/storetoken', {
      public_token: token
    })
    .then((res) => {
      this.setState({isToggleOn: true})
      this.props.history.push('/transactions')
    });
  }

  render() {

    return(
      <div className="app">   
        <nav class="navbar navbar-expand-lg">
          <h5 class="navbar-brand ml-5">Aggregate.io</h5>
          <button class="navbar-toggler ml-auto custom-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
        
          <div class="collapse navbar-collapse mr-5" id="navbarSupportedContent">
              <ul class="navbar-nav mr-auto"></ul>
              <ul class="navbar-nav">
                  <li class="nav-item pr-5">
                    <a class="nav-link" href="https://plaid.com/">api</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="https://github.com/mattfrances">github</a>
                  </li>
              </ul>
          </div>
        </nav>

        <div id="home">
          <div class="landing-text">
            <h1>All your transactions,</h1>
            <h3>in 1 place.</h3>
            <PlaidLink
              clientName="Aggregate.io"
              env="sandbox"
              product={["transactions"]}
              publicKey="c90241cd94d6023284762e65669f07"
              onSuccess={this.handleOnSuccess}>
              Get started
            </PlaidLink>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
