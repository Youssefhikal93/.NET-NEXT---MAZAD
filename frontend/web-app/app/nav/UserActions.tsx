"use client"
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from "react-icons/ai";
import {HiCog, HiUser} from "react-icons/hi"

type Props = {
  user : User;
}

export default function UserActions({user}:Props) {
  return (
    // <div>
      <Dropdown inline label={`Welcome ${user.username}`}
      className="cursor-pointer">
        <DropdownItem icon={HiUser}>
          My Auctions
        </DropdownItem>
          <DropdownItem icon={AiFillTrophy}>
          Auctions won
        </DropdownItem>
          <DropdownItem icon={AiFillCar}>
          Sell my car
        </DropdownItem>
         <DropdownItem icon={HiCog}>
          <Link href="/session">
          Session (Dev only!) 
          </Link>
        </DropdownItem>
        <DropdownDivider/>
        <DropdownItem icon={AiOutlineLogout} onClick={()=>signOut({redirectTo:"/"})}>
          Sign out
        </DropdownItem>
      </Dropdown>
    // </div>
  )
}
