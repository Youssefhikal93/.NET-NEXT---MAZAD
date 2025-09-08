import EmptyFilter from "@/app/Components/EmptyFilter";

export default async function Signin({searchParams}:{searchParams : Promise<{callbackUrl:string}>}) {
  const params = await searchParams;
  return (
    <EmptyFilter showLogin title="You need to login to do that" subtitle="Please click below to login" callbackUrl={params.callbackUrl}/>
  )
}
