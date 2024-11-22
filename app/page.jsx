import { UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div>
      <h2 className="text-primary">Hello world</h2>
      <UserButton />
    </div>
  );
}




