import { auth } from "@/auth"
import Heading from "../Components/Heading";

export default async function Session() {

    const session = await auth();
    console.log(session)
  return (
    <div>
        <Heading title="Session dashboard" subtitle={""}/>
        <div className="bg-blue-200 border-2 border-blue-500">
            <h3 className="text-lg">Session Data</h3>
            
        </div>
    </div>
  )
}
