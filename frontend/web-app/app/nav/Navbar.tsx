import { AiOutlineCar } from "react-icons/ai";

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 flex justify-between bg-white items-center text-gray-800 px-3 py-4'>
        <div className='flex items-center gap-2 text-2xl font-semibold text-red-900'>
      <AiOutlineCar size={34}/>
      <div>Mazad Auctions</div>
        </div>
        <div>search</div>
        <div>login</div>
    </header>
  )
}
