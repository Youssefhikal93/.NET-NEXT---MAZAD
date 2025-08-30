import { AiOutlineCar } from "react-icons/ai";
import Search from "./Search";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 flex justify-between bg-white items-center text-gray-800 px-3 py-4 gap-12'>
       <Logo/>
      <Search/>
       
        <div>login</div>
    </header>
  )
}
