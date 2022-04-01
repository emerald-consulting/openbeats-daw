import { useState } from "react"

const useInput = (validCheck)=>{
    const [value, setValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const isValid = validCheck(value);
    const hasError = !isValid && isTouched;

    const inputChangeHandler = (event)=>{
        setValue(event.target.value);
    }

    const inputBlueHandler = (event)=>{
        setIsTouched(true);
    }

    const reset = (event)=>{
        setValue('');
        setIsTouched(false);
    }

    return{
        value,
        isTouched,
        isValid,
        hasError,
        inputChangeHandler,
        inputBlueHandler,
        reset
    }
}

export default useInput;