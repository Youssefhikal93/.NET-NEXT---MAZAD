import { Suspense } from "react";
import Listings from "./auctions/Listings";
import LoaderSpinner from "./Components/LoaderSpinner";


export default function Home() {
  return (
    <div >
<Suspense fallback={<LoaderSpinner>{"Please wait..."}</LoaderSpinner>}>      <Listings/>
      </Suspense>
    </div>
  );
}
