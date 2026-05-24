import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "@/features/chat/chat";

export const Route = createFileRoute("/(_authenticated)/rooms/$room")({
  component: RoomPage,
});

function RoomPage() {
  const { room } = Route.useParams();
  return <Chat roomId={room} />;
}
