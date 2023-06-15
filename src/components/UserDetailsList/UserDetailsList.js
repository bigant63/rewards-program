import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

const UserDetailsList = ({ id, totals, onShowDetails = ()=>{} }) => {
    const { totalPoints, totalSpent } = totals;
    
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
            onClick={onShowDetails}
            size="sm"
            variant="link"
          >
            Show/Hide Details
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



export default UserDetailsList;