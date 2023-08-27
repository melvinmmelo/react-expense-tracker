import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import Buttons from '../components/UI/Buttons';
import { ExpensesContext } from '../store/expenses-store';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

function ManageExpense({route, navigation }) {

  const [isSubmitting, setIsSubmitting ] = useState(false)

  const [error, setError] = useState();

  const expensesCtx = useContext(ExpensesContext)

  const editedExpId = route.params?.expenseId

  const isEditing = !!editedExpId

  const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpId)

  async function deletePressHandler(){
    setIsSubmitting(true);

    try {
      await deleteExpense(editedExpId)
      expensesCtx.deleteExpense(editedExpId)
      navigation.goBack();
    } catch (error) {
      setError('Could not delete expense!')
    }
  }
  function cancelHandler(){
    navigation.goBack()
  }
  async function confirmHandler(expenseData) {
    setIsSubmitting(true);

    try {
      if (isEditing) {
        expensesCtx.updateExpense(editedExpId, expenseData);
        await updateExpense(editedExpId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();

    } catch (error) {
      setError('Could not save the expense.')
      setIsSubmitting(false)
    }
  }

  useLayoutEffect(() => {

      navigation.setOptions({
        title: isEditing ? 'Edit expense' : 'Add expense'
      })

  }, [navigation, isEditing])

  if (error && !isSubmitting){
    return <ErrorOverlay message={error}/>
  }


  if (isSubmitting) {
    return <LoadingOverlay />;
  }


  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Edit" : "Add"}
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        defaulValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deletePressHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center'
  }
})