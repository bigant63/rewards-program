import PropTypes from "prop-types";
import styles from "./UserInfo.css";
 import UserDetailsList from "../UserDetailsList/UserDetailsList";
 import UserInfoTable from "../UserInfoTable/UserInfoTable";
import { useState } from "react";

export const UserInfo = ({ customer, transactions, totals }) => {
  
  const UserInfo = ({ customer, totals, transactions }) => {
    const { name, picture, phone } = customer;
    const [showTransactions, setShowTransactions] = useState(false);
   const handleShowDetails = () => { setShowTransactions(!showTransactions); };

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
            {<UserDetailsList onShowDetails={handleShowDetails} totals={totals} /> }
          </div>
        </div>
        {showTransactions && <UserInfoTable transactions={transactions} /> }
      </div>
    );
  };

  return (
    
      <UserInfo
        key={customer?.login?.uuid}
        customer={customer}
        transactions={transactions}
        totals={totals}
      />
    
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
  totalTransactions: PropTypes.arrayOf(PropTypes.object),
  totals: PropTypes.shape({
    totalSpent: PropTypes.string,
    totalPoints: PropTypes.string,
  }),
};

export default UserInfo;
