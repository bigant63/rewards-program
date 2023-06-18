import Table from "react-bootstrap/Table";
import {usdFormatter} from "../../hooks";
import PropTypes from "prop-types";
import styles from "./UserInfoTable.css";


const UserInfoTable = ({ transactions }) => {
  
  return (
    <div className={styles.tableContainer}>
      <Table striped responsive bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Amount Spent Per Day</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
        {transactions?.map(({ date, totalsPerDay }) => {
          
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

UserInfoTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      totalsPerDay: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
        totalPoints: PropTypes.number.isRequired,
      })
    }
  ))
}

export default UserInfoTable;
