import validatejs from "validate.js";

export default function RNFormHelpers({ dictionary }) {
  const service = {
    onInputChange,
    getInputValidationState,
    validateInput,
    getFormValidation,
    setInputPosition,
    getFirstInvalidInput
  };

  function onInputChange(inputs, setInputs, { id, value, cb = () => {} }) {
    setInputs((inputs) => ({
        ...inputs,
        [id]: getInputValidationState({
          input: inputs[id],
          value
        })
      })
    );
  }
  
  function onSetInputs(changes, setInputs) {
    setInputs((inputs) => ({ ...inputs, ...Object.fromEntries(Object.entries(changes).map(([k, v]) => ([k, { value: v }))) })    
  }

  function getInputValidationState({ input, value, touched }) {
    return {
      ...input,
      value,
      errorLabel: input.optional
        ? null
        : validateInput({ type: input.type, value }),
      touched: touched || input.touched
    };
  }

  function validateInput({ type, value }) {
    const result = validatejs(
      {
        [type]: value
      },
      {
        [type]: dictionary[type]
      }
    );

    if (result) {
      return result[type][0];
    }

    return null;
  }

  function getFormValidation(inputs, setInputs) {
    // const { inputs } = this.state;

    const updatedInputs = {};

    for (const [key, input] of Object.entries(inputs)) {
      updatedInputs[key] = getInputValidationState({
        input,
        value: input.value,
        touched: true
      });
    }

    // this.setState({
      // inputs: updatedInputs
    // });
    setInputs(updatedInputs);

    return getFirstInvalidInput({ inputs: updatedInputs });
  }

  function setInputPosition(inputs, setInputs, { ids, value }) {
    // const { inputs } = this.state;

    const updatedInputs = {
      ...inputs
    };

    ids.forEach(id => {
      updatedInputs[id].yCoordinate = value;
    });

    setInputs(updatedInputs);

    // this.setState({
    //   inputs: updatedInputs
    // });
  }

  function getFirstInvalidInput({ inputs }) {
    let firstInvalidCoordinate = Infinity;

    for (const [key, input] of Object.entries(inputs)) {
      if (input.errorLabel && input.yCoordinate < firstInvalidCoordinate) {
        firstInvalidCoordinate = input.yCoordinate;
      }
    }

    if (firstInvalidCoordinate === Infinity) {
      firstInvalidCoordinate = null;
    }

    return firstInvalidCoordinate;
  }

  return service;
}
