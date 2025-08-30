import { Button } from "flowbite-react";
import Link from "next/link";

export default function UserActions() {
  return (
    <div>
      <Button outline color="gray">
        <Link href={"/session"}>Session</Link>
      </Button>
    </div>
  )
}
