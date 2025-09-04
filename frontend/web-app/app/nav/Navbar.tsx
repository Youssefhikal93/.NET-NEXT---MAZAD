import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { getCurrentUser } from "../_lib/actions/authActions";
import UserActions from "./UserActions";

export default async function Navbar() {

  const user = await getCurrentUser();
  return (
    <header className='sticky top-0 z-50 grid sm:grid-cols-3 md:flex justify-between bg-white items-center text-gray-800 px-3 py-4 gap-9 border-b-1 border-gray-100'>
       <Logo/>
      <Search/>
       {user ?  <UserActions user={user}/> : <LoginButton/>}
        
    </header>
  )
}
