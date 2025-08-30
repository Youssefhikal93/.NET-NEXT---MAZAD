import { auth } from "@/auth"
import Heading from "../Components/Heading";
import AuthTest from "./AuthTest";

export default async function Session() {

    const session = await auth();
    console.log(session)
  return (
    <div>
        <Heading title="Session dashboard" subtitle={""}/>
        <div className="bg-red-200 border-2 border-red-500">
            <h3 className="text-lg">Session Data</h3>
             <pre className="break-all whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
        </div>
        <div className="mt-4">

        <AuthTest/>
        </div>
    </div>
  )
}
