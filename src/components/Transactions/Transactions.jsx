import React from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';

import './Transactions.css';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/transactions')
    .then((res) => {
      var data = res["data"]["transactions"]
      this.setState({ tableData: data });
    });
  }

  render() {
    return (
      <div className="transactions">
        <h1>Transactions</h1>
        <Table hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tableData.map((transaction, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{transaction.name}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.category[0]}</td>
                  <td>{transaction.date}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Transactions;