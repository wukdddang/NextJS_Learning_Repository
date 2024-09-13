import {useSearchParams} from "next/navigation";
import {useMemo} from "react";

/**
 * This function is used when deploying an example on liveblocks.io.
 * You can ignore it completely if you run the example locally.
 */
export function useRoomId(roomId: string) {
  const searchParams = useSearchParams();
  const exampleRoomId = useMemo(() => {
    return query?.exampleId ? `${roomId}-${query.exampleId}` : roomId;
  }, [query, roomId]);
  
  return exampleRoomId;
}
