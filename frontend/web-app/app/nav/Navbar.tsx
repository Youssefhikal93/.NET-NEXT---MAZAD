import { AiOutlineCar } from "react-icons/ai";
import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { getCurrentUser } from "../_lib/actions/authActions";
import UserActions from "./UserActions";

export default async function Navbar() {

  const user = await getCurrentUser();
  return (
    <header className='sticky top-0 z-50 flex justify-between bg-white items-center text-gray-800 px-3 py-4 gap-12'>
       <Logo/>
      <Search/>
       {user ?  <UserActions/> : <LoginButton/>}
        
    </header>
  )
}
