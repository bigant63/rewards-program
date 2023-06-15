import PropTypes from "prop-types";
import { useEffect } from "react";
import styles from "./UserInfo.css";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

// import styles from './Table.css';

export const UserInfo = ({ users = [] }) => {
  //  const { data = {} } = query;
  const handleShowDetails = (e) => {
    e.preventDefault();
    console.log(
      "handleShowDetails",
      e.currentTarget.attributes["data-id"].value
    );
  };

  const toggleDetails = (e, id = 0) => {
    <a href="#" data-id={id} onClick={handleShowDetails}>
      View Details
    </a>;
  };

  const UserInfoTable = ({ totalsPerDay }) => {
    return (
      <div className="table-container">
        {totalsPerDay.map(({ date, transactions }) => {
          return (
            <tr key={date}>
              <td>{date}</td>
              <td>
                {transactions.map(({ amount }) => {
                  return <div key={amount}>{amount}</div>;
                })}
              </td>
            </tr>
          );
        })}

        <Table striped responsive bordered hover>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Total Amount Spent</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ customer, totalTransactions, totals }, index) => {
              const id = customer?.login?.uuid ?? index;

              return (
                <div className={styles.userInfoContainer}>
                  <UserInfo customer={customer} />
                </div>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };

  const UserInfo = ({ customer }) => {
    const { name, picture, phone, login } = customer;
    const id = login?.uuid;
    return (
      <div className="user-info">
        {picture.medium && <img src={picture.medium} alt={name} />}
        <ul>
          <li>
            <span>Name:</span> {name}
          </li>
          <li>
            <span>Phone:</span> {phone}
          </li>
          <li>
          <Button data-id={id} onClick={handleShowDetails} size="sm" variant="link">
          Show Details
        </Button>
          </li>
        </ul>
        
      </div>
    );
  };

  /**
   * Handles the submit form
   * @param {Object} stepData - reviewers and step description from modal
   */

  return (
    <div className={styles.tableContainer}>
      {users.map(({ customer, totalTransactions, totals }, index) => {
        return <UserInfo customer={customer} />;
      })}
      ]
    </div>
  );
};

UserInfo.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default UserInfo;
