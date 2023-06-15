import PropTypes from 'prop-types';
import { useEffect } from 'react';
import styles from './Table.css';


// import { useGrantReviewerAccess, usePrevious,  } from './hooks/';
// import styles from './Table.css';



export const Table = ({
  users = [], 
}) => {




  // const query = useSpotReviewerValidator({
  //   spotId,
  //   reviewStages,
  //   reviewers: getUniqueReviewers(reviewStages),
  //   onError: (error) => {
  //     showErrorNotification({
  //       error,
  //       message: strings.errors.validateStepReviewersError,
  //       loggerErrorMsg: 'Error checking access on step reviewers.',
  //     });
  //   },
  //   currentReviewer: spotOwner,
  // });

//  const { data = {} } = query;
  const handleShowDetails = (e) => {
    e.preventDefault();
    console.log('handleShowDetails', e.currentTarget.id  )
  }

const UserInfo = ({ customer })=> {
  const { name, picture } = customer;
  return (
    <div className={styles.UserInfo}>
    <img src={picture.thumbnail} alt={name} />
    <ul>
      <li>Name: {name}</li>
      <li>Title: {name}</li>
    </ul>
    </div>
  )
}



  useEffect(() => {
    
  }, []);

 


  /**
   * Handles the submit form
   * @param {Object} stepData - reviewers and step description from modal
   */





  return (
    <div className={styles.tableContainer}>
     <table>
  <thead>
    <tr><td>User Info</td></tr>
    <tr><td>Total Amount Spent</td></tr>
    <tr><td>Reward Points</td></tr>
    <tr><td>Details</td></tr>
    </thead>
    <tbody>
      {users.map((user , index) => {
        
        return (
          <tr key={user.id}>
           <td> 
           <UserInfo customer={user} />
           </td>
           <td>0</td>
           <td>0</td>
           <td> <a href='#' data-id={user?.id} onClick={handleShowDetails}>View Details</a></td>
          </tr>
        )
      })}
      </tbody>
     </table>
    </div>
  );
};

Table.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

export default Table;