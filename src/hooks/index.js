import { useQuery } from "react-query";
import dayjs from "dayjs";
import failoverData from "../__mock__/customers.json";
const MAX_TRANSACTIONS_PER_DAY = 10;
const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const numFormatter = new Intl.NumberFormat('en-US');

  

export const spendingGenerator = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getSummaryTotals = (transactions) => {
  let totalPoints = 0;
  let totalSpent = 0;
  transactions.forEach((transaction) => {
    const { totalsPerDay = {} } = transaction;
    totalSpent += totalsPerDay.totalAmount;
    totalPoints += totalsPerDay.totalPoints;
  });
  
  return { totalPoints: numFormatter.format(totalPoints), totalSpent: usdFormatter.format(totalSpent) };
};

/**
 * generates transactions for the past 3 months
 * @param {Number} months - months is not used, but could be used to generate transactions for the past x months
 */
export const generateDates = (months = 3) => {
  let start = dayjs().subtract(months, "month");
  
  const end = dayjs().subtract(1, "day");
  const dates = [];
  while (start.isBefore(end)) {
    dates.push(start.format("YYYY-MM-DD"));
    start = start.add(1, "day");
  }

  return dates;
};

// we want to generate points per transaction and get totals
export const getTotals = (transactions) => {
  let points = 0;
  let totalAmount = 0;
  let totalPoints = 0;
  // const totalAmount = transactions.reduce((prevAmt, {amount}) => amount + prevAmt, 0)

  transactions.forEach((transaction) => {
    const { amount = 0 } = transaction;
    if (amount > 100) {
      points += (amount - 100) * 2; // A customer receives 2 points for every dollar spent over $100
    } else if (amount > 50) {
      points += amount - 50; //  plus 1 point for every dollar spent between $50 and $100 in each transaction.
    }
    totalAmount += amount;
    totalPoints += points;
  });

  return { points, totalAmount, totalPoints };
};

export const useTransactionGenerator = ({
  customers = 500,
  onError = () => {
    return failoverData;
  },
}) => {
  const query = useQuery(
    ["customers", customers],

    async () => {
      const response = await fetch(
        `https://randomuser.me/api/?results=${customers}`
      );
      const data = await response.json();
      return data;
    },
    {
      onError,
      enabled: customers > 0,
      refetchOnWindowFocus: false,
    }
  );
  const { data } = query;
  let customerData = [];
  
  if (data?.results) {
    
    customerData =  data?.results?.map((customer) => {
      const getTransactionPerDay = () => {
        const transactionsPerDay =
          Math.floor(Math.random() * MAX_TRANSACTIONS_PER_DAY) + 1;

        // use spendingGenerator to generate a random amount
        return Array.from({ length: transactionsPerDay }, () => ({
          amount: spendingGenerator(),
        }));
      };

      const totalTransactions = generateDates().map((date) => {
        const transPerDay = getTransactionPerDay();

        return {
          date,
          transactions: transPerDay,
          totalsPerDay: getTotals(transPerDay),
        };
      });

      const totals = getSummaryTotals(totalTransactions);
      const { first, last } = customer.name;
      const customerName = `${first} ${last}`;

      return {
        totals,
        totalTransactions,
        customer: { ...customer, name: customerName },
      };
    });
  }

  return query?.isSuccess
    ? {
        ...query,
        customers: customerData
      }
    : {};
};
