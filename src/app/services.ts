import { distinctUntilChanged, map, Observable, shareReplay, tap } from "rxjs";
import { collectionData } from "rxfire/firestore";
import {
  collection,
  doc,
  limit,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase-setup";
import { useObservable } from "./useObservable";
import isEqual from "fast-deep-equal/es6";

export interface IPostDoc {
  threadId: string;
  content: string;
  sentAt: null | Timestamp;
}

function observePosts(threadId: string) {
  console.debug("observePosts called");

  return collectionData(
    query(
      collection(db, "posts"),
      where("threadId", "==", threadId),
      where("sentAt", "!=", null),
    ),
    { idField: "id" },
  ).pipe(
    distinctUntilChanged(isEqual),
    tap((posts) => console.log(`Posts for thread "${threadId}"`, posts)),
    shareReplay(1),
  ) as Observable<Array<IPostDoc & { id: string }>>;
}

export function usePosts(threadId: string) {
  return useObservable(() => observePosts(threadId), {
    deps: [threadId],
  });
}

function observeDraft(threadId: string) {
  console.debug("observeDraft called");

  return collectionData(
    query(
      collection(db, "posts"),
      where("threadId", "==", threadId),
      where("sentAt", "==", null),
      limit(1),
    ),
    { idField: "id" },
  ).pipe(
    map((drafts) => drafts[0] ?? null),
    distinctUntilChanged(isEqual),
    tap((draft) => console.log(`Draft for thread "${threadId}"`, draft)),
    shareReplay(1),
  ) as Observable<(IPostDoc & { id: string }) | null>;
}

export function useDraft(threadId: string) {
  return useObservable(() => observeDraft(threadId), {
    deps: [threadId],
  });
}

export function createDraft(threadId: string) {
  console.debug("createDraft called");

  return addDoc(collection(db, "posts"), {
    threadId,
    content: "",
    sentAt: null,
  });
}

export function updateDraft(draftId: string, draftUpdate: Partial<IPostDoc>) {
  console.debug("updateDraft called");

  return updateDoc(doc(db, "posts", draftId), draftUpdate);
}
