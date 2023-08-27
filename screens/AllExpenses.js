import { useContext } from 'react';
import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-store';

function AllExpenses() {

  const expensesCtx = useContext(ExpensesContext)

  return (
    <ExpensesOutput
      expenses={expensesCtx.expenses}
      expensesPeriod="Total"
      fallbackText="No data available."
    />
  );
}

export default AllExpenses;
