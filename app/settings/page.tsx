import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { Card, CardHeader, CardTitle, CardContent } from "../components/card";
import ProfileForm from "./profile-form";
import SignOutForm from "./sign-out-form";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-white">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <SignOutForm />
        </CardContent>
      </Card>
    </div>
  );
}
