import EmptyFilter from "@/app/Components/EmptyFilter";

export default function Signin({searchParams}:{searchParams : {callbackUrl:string}}) {
  return (
    <EmptyFilter showLogin title="You need to login to do that" subtitle="Please click below to login" callbackUrl={searchParams.callbackUrl}/>
  )
}
