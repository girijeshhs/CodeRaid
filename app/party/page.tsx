import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { Card, CardHeader, CardTitle, CardContent } from "../components/card";
import CreatePartyForm from "./create-party-form";
import JoinPartyForm from "./join-party-form";
import { EmptyState } from "../components/empty-state";

export default async function PartyPage() {
  const userId = await requireUserId();

  const memberships = await prisma.partyMembership.findMany({
    where: { userId },
    include: { party: true },
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-white">Parties</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create a party</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePartyForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join with invite code</CardTitle>
        </CardHeader>
        <CardContent>
          <JoinPartyForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your parties</CardTitle>
        </CardHeader>
        <CardContent>
        {memberships.length === 0 ? (
          <EmptyState
            icon="🎈"
            title="No parties joined yet"
            description="You haven't joined any parties. Create a new party or join one with an invite code."
          />
        ) : (
          <ul className="mt-4 grid gap-4">
            {memberships.map((m) => (
              <li key={m.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-5 text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900">
                <strong className="mb-1 block text-lg text-amber-500">{m.party.name}</strong> invite: {m.party.inviteCode}
                <div className="text-zinc-400">{m.party.description ?? ""}</div>
              </li>
            ))}
          </ul>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
