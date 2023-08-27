import { useContext, useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import Buttons from '../components/UI/Buttons';
import { ExpensesContext } from '../store/expenses-store';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';

function ManageExpense({route, navigation }) {

  const expensesCtx = useContext(ExpensesContext)

  const editedExpId = route.params?.expenseId

  const isEditing = !!editedExpId

  const selectedExpense = expensesCtx.expenses.find(expense => expense.id === editedExpId)

  function deletePressHandler(){
    console.log('Deleting expense.' + editedExpId)
    expensesCtx.deleteExpense(editedExpId)
    navigation.goBack();
  }
  function cancelHandler(){
    navigation.goBack()
  }
  function confirmHandler(expenseData) {
    if(isEditing){
      expensesCtx.updateExpense(editedExpId, expenseData);
    }else{
      expensesCtx.addExpense(expenseData);
    }
    navigation.goBack();
  }

  useLayoutEffect(() => {

      navigation.setOptions({
        title: isEditing ? 'Edit expense' : 'Add expense'
      })

  }, [navigation, isEditing])

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