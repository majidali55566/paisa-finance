"use client";
import { useParams } from "next/navigation";

export default function AccountPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div>
      <h1>Transactions for Account {id}</h1>
      {/* Fetch or render transactions for account {id} */}
    </div>
  );
}
