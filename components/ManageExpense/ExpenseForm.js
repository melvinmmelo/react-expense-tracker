import { Alert, StyleSheet, Text, View } from "react-native"
import Input from "./Input"
import { useState } from "react";
import Buttons from "../UI/Buttons";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaulValues }) {

  const [inputs, setInputs] = useState({
    amount: {
      value: defaulValues ? defaulValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaulValues ? getFormattedDate(defaulValues.date) : "",
      isValid: true,
    },
    description: {
      value: defaulValues ? defaulValues.description : "",
      isValid: true,
    },
  });

  function inputChangeHandler(inputIdentifier, enteredValue){
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    })
  }

  function submitHandler(){
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value
    }

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0
    const dateIsValid = expenseData.date.toString() !== 'Invalid Date'
    const descIsValid = expenseData.description.trim().length > 0

    if(!amountIsValid || !dateIsValid || !descIsValid){
      // Alert.alert('Invalid input!', 'Please check your input values.')
      setInputs((curInputs) => {
        return{
          amount: { value: curInputs.amount.value, isValid: amountIsValid},
          date: { value: curInputs.date.value, isValid: dateIsValid},
          description: { value: curInputs.description.value, isValid: descIsValid}
        }
      })
      return
    }

    onSubmit(expenseData);
  }

  const formIsValid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your expense</Text>
      <View style={styles.inputsRow}>
        <View style={styles.rowInput}>
          <Input
            label="Amount"
            invalid={!inputs.amount.isValid}
            textInputConfig={{
              keyboardType: "decimal-pad",
              onChangeText: inputChangeHandler.bind(this, "amount"),
              value: inputs.amount.value,
            }}
          />
        </View>
        <View style={styles.rowInput}>
          <Input
            label="Date"
            invalid={!inputs.date.isValid}
            textInputConfig={{
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
              onChangeText: inputChangeHandler.bind(this, "date"),
              value: inputs.date.value,
            }}
          />
        </View>
      </View>

      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autoCapitalize: 'none',
          // autoCorrect: false // default is true
          onChangeText: inputChangeHandler.bind(this, "description"),
          value: inputs.description.value,
        }}
      />
      {formIsValid && (<Text style={styles.errorText}>Invalid input values. Please check your entered data.  </Text>)}
      <View style={styles.buttons}>
        <Buttons style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Buttons>
        <Buttons style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Buttons>
      </View>
    </View>
  );
}

export default ExpenseForm

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  errorText:{
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});