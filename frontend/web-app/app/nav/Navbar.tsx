import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { getCurrentUser } from "../_lib/actions/authActions";
import UserActions from "./UserActions";

export default async function Navbar() {

  const user = await getCurrentUser();
  return (
    <header className='sticky top-0 z-50 
    flex flex-col 
    sm:flex-row justify-center sm:justify-between 
    items-center bg-white text-gray-800 px-3 py-4 gap-4 border-b border-gray-100'>
      
       <Logo/>
      <Search/>
       {user ?  <UserActions user={user}/> : <LoginButton/>}
        
    </header>
  )
}
