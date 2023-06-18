// not going to test the full functionality of the useTransactionGenerator hook, just the getTotals
// import { renderHook } from '@testing-library/react-hooks';
import { getTotals } from "../index";

describe("getTotals", () => {
  it("should return the correct totals", () => {
    // amounts less than 50 should return 0 points
    expect(getTotals([{ amount: 49 }])).toEqual({
      totalAmount: 49,
      totalPoints: 0,
    });

    // amounts less than 100 should return 1 point per dollar spent
    expect(getTotals([{ amount: 99 }])).toEqual({
      totalAmount: 99,
      totalPoints: 49,
    });

    expect(getTotals([{ amount: 76 }])).toEqual({
      totalAmount: 76,
      totalPoints: 26,
    });


    // amounts greater than 100 should return 2 points per dollar spent
    expect(getTotals([{ amount: 101 }])).toEqual({
      totalAmount: 101,
      totalPoints: 52,
    });

    expect(getTotals([{ amount: 190 }])).toEqual({
      totalAmount: 190,
      totalPoints: 230,
    });

    expect(getTotals([{ amount: 210 }])).toEqual({
      totalAmount: 210,
      totalPoints: 270,
    });
    
    // example given
    expect(getTotals([{ amount: 120 }])).toEqual({
      totalAmount: 120,
      totalPoints: 90,
    });

        // multiple transactions
        expect(getTotals([{ amount: 86 }, {amount: 76}, {amount: 56}])).toEqual({
          totalAmount: 218,
          totalPoints: 68,
        });
    
  });
});
