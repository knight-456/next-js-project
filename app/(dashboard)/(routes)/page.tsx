import { UserButton } from "@clerk/nextjs/app-beta/client";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
