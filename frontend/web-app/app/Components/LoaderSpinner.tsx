import { Spinner } from "flowbite-react";

type Props = {
  children: string; 
}

export default function LoaderSpinner({children}:Props) {
  return (
     <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col justify-center items-center">
                <Spinner color="failure" size="xl"/> 
                <p className="mt-2 text-red-900 text-xs">{children}</p>
            </div>
        </div>
  )
}
