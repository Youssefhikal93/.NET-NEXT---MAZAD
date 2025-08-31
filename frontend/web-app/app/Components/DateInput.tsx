import { createTheme, ThemeProvider} from "flowbite-react";
import "react-datepicker/dist/react-datepicker.css";
import { useController, UseControllerProps } from "react-hook-form";
import DatePicker,{DatePickerProps} from 'react-datepicker';


const customTheme = createTheme({
   "textInput": {
    "field": {
       "input":{
           "colors":{
            "accent":"focus:border-red-800 focus:ring-red-800"
           }
       },
  },
}
});

type Props ={
    label:string;
    type?:string;
} & UseControllerProps & DatePickerProps


export default function DateInput(props:Props) {
    const {field,fieldState} = useController({...props})
  return (
    <ThemeProvider theme={customTheme}>

  
          <div className="mb-3 block">
            
          <DatePicker 
          
          {...props}
          {...field}
          placeholderText={props.label}
          selected={field.value}
          className={`rounded-lg w-full border-gray-600 p-2 flex flex-col ${fieldState.error ? "bg-red-50 border-red-500 text-red-900": (!fieldState.invalid && fieldState.isDirty) ? "bg-green-50 border-green-500 text-green-900": ""}`}
            />
          {fieldState.error && (
            <div className="text-red-500 text-sm">{fieldState.error.message}</div>
          )}
          </div>
          </ThemeProvider>
  )
}
