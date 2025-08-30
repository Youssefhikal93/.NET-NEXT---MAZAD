"use client";
import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";

function NotFound() {
  const [number, setNumber] = useState("000");

  useEffect(() => {
    randomNumberText("404", setNumber);
  }, []);

  return (
    <main className="text-center space-y-6 mt-4">
      <h2 className="text-6xl font-bold opacity-100 hover:text-red-800">
        {number}
      </h2>
      <h1 className="text-3xl font-semibold">
        This page could not be found :(
      </h1>
      <Link
        href="/"
        className="inline-block bg-accent-500 text-red-800 px-6 py-3 text-lg hover:bg-gray-300"
      >
        Go back home
      </Link>
     

    </main>
  );
}

export const randomNumberText = (finalNum: string , setNumber: { (value: SetStateAction<string>): void; (arg0: string): void; }) => {
  let count = 0;
  const interval = setInterval(() => {
    let newNum = "";
    for (let i = 0; i < finalNum.length; i++) {
      newNum += Math.floor(Math.random() * 10);
    }
    setNumber(newNum);
    count++;

    if (count === 15) {
      clearInterval(interval);
      setNumber(finalNum);
    }
  }, 80);
};

export default NotFound;