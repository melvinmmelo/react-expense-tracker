import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-store";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {

  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState()
  const expensesCtx = useContext(ExpensesContext)


  // const [fetchedExpenses, setFetchedExpenses] = useState([])
  useEffect(() => {
    setIsFetching(true)
    async function getExpenses(){

      try {
        const expenses = await fetchExpenses()
        expensesCtx.setExpenses(expenses)
      } catch (error) {
        setError('Could not fetch expenses!')
      }

      setIsFetching(false)
    }

    getExpenses()
  }, [])

  if (error && !isFetching){
    return <ErrorOverlay message={error} />;
  }

  if (isFetching){
    return <LoadingOverlay />
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const dateDaysAgo = getDateMinusDays(today, 7);

    return expense.date > dateDaysAgo && expense.date <= today;
  });

  return (
    <ExpensesOutput expenses={recentExpenses} expensesPeriod="Last 7 Days" fallbackText="No data available in 7 days."/>
  );
}

export default RecentExpenses;
