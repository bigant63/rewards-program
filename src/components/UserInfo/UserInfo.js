import PropTypes from "prop-types";
import styles from "./UserInfo.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import {usdFormatter} from "../../hooks";


export const UserInfo = ({ users = [] }) => {
  const UserInfoTable = ({ transactions }) => {
    return (
      <div className="table-container">
        <Table striped responsive bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Amount Spent</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
          {transactions.map(({ date, totalsPerDay }) => {
            
          return (
            <tr key={date}>
              <td>{date}</td>
              <td>
                {usdFormatter.format(totalsPerDay.totalAmount)}
              </td>
              <td>
                {totalsPerDay.totalPoints}
              </td>
            </tr>
          );
        })}
          </tbody>
        </Table>
      </div>
    );
  };

  const UserDetailsList = ({ id, totals }) => {
    const { totalPoints, totalSpent } = totals;

    const handleShowDetails = (e) => {
      e.preventDefault();
      console.log(
        "handleShowDetails",
        e.currentTarget.attributes["data-id"].value
      );
    };

    return (
      <>
      <ul>
        <li>
          <span>Total points for the last 3 months:</span> {totalPoints}
        </li>
        <li>
          <span>Total dollars spent for the last 3 months:</span> {totalSpent}
        </li>
        <li>
          <Button
            data-id={id}
            onClick={handleShowDetails}
            size="sm"
            variant="link"
          >
            Show Details
          </Button>
        </li>
      </ul>
      
      </>
    );
  };

  UserDetailsList.propTypes = {
    totals: PropTypes.shape({
      totalPoints: PropTypes.string,
      totalSpent: PropTypes.string,
    }),
  };

  const UserInfo = ({ customer, totals, transactions }) => {
    const { name, picture, phone } = customer;

    return (
      <div className="user-info">
        <div className="user-info-summary">
        {picture.medium && <img src={picture.medium} alt={name} />}
        <div className="user-details-container">
          <ul>
            <li>
              <span>Name:</span> {name}
            </li>
            <li>
              <span>Phone:</span> {phone}
            </li>
          </ul>
          <UserDetailsList totals={totals} />
        </div>
        </div>
        <UserInfoTable transactions={transactions} />
      </div>
    );
  };

  UserInfo.propTypes = {
    customer: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      login: PropTypes.shape({
        uuid: PropTypes.string,
      }),
      picture: PropTypes.shape({
        medium: PropTypes.string,
      }),
    }),
  };

  return (
    <div className={styles.tableContainer}>
      {users.map(({ customer, totalTransactions, totals }, index) => {
        
        return (
          <UserInfo
            key={customer?.login?.uuid}
            customer={customer}
            transactions={totalTransactions}
            totals={totals}
          />
        );
      })}
    </div>
  );
};

UserInfo.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default UserInfo;
