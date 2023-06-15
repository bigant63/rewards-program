// not going to test the full functionality of the useTransactionGenerator hook, just the getTotals
// import { renderHook } from '@testing-library/react-hooks';
import { getTotals } from "../index";

describe("getTotals", () => {
  it("should return the correct totals", () => {
    // amounts less than 50 should return 0 points
    expect(getTotals([{ amount: 49 }])).toEqual({
      points: 0,
      totalAmount: 49,
      totalPoints: 0,
    });

    // amounts less than 100 should return 1 point per dollar spent
    expect(getTotals([{ amount: 99 }])).toEqual({
      points: 49,
      totalAmount: 99,
      totalPoints: 49,
    });
    // amounts greater than 100 should return 2 points per dollar spent
    console.log('totoals', getTotals([{ amount: 101 }]))
    expect(getTotals([{ amount: 101 }])).toEqual({
      points: 52,
      totalAmount: 101,
      totalPoints: 52,
    });


    // example given
    expect(getTotals([{ amount: 120 }])).toEqual({
      points: 90,
      totalAmount: 120,
      totalPoints: 90,
    });
  });
});
