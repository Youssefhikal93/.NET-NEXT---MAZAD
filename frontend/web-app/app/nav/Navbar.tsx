"use client";
import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import UserActions from "./UserActions";
import { useSession } from "next-auth/react";

export default function Navbar() {
const session = useSession();
  const user = session.data?.user;

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
