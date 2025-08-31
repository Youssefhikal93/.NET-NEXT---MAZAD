import { createTheme, HelperText, Label, TextInput, ThemeProvider } from "flowbite-react";
import { useController, UseControllerProps } from "react-hook-form";

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
    showlabel?:boolean;
} & UseControllerProps


export default function Input(props:Props) {
    const {field,fieldState} = useController({...props})
  return (
    <ThemeProvider theme={customTheme}>
          <div className="mb-3 block">
            {props.showlabel && (
                <div className="mb-2 block">
                    <Label htmlFor={field.name}>{props.label}</Label>
                </div>
            )}
          <TextInput 
          placeholder={props.label} 
          {...props}
          {...field}
          value={field.value || ""}
          type={props.type || "text"}
          color={fieldState?.error ? "failure" : !fieldState.isDirty ? "accent" : "success"}  />
          <HelperText color="failure">
            {fieldState?.error?.message as string}
          </HelperText>
          </div>
        </ThemeProvider>
  )
}
