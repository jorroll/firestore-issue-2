import { ComponentType, useCallback } from "react";
import { createDraft, useDraft, usePosts } from "./services";
import { Timestamp } from "firebase/firestore";
import {
  createFormControl,
  IFormControl,
  useControl,
  useControlState,
} from "solid-forms-react";
import { IPostDoc, updateDraft } from "./services";

const THREAD_ID = "1";

export default function App() {
  const posts = usePosts(THREAD_ID);
  const draft = useDraft(THREAD_ID);

  const onNewDraftButtonClick = useCallback(() => {
    createDraft(THREAD_ID);
  }, []);

  return (
    <div>
      <div>
        <button
          type="button"
          disabled={!!draft}
          onClick={onNewDraftButtonClick}
          className="rounded border-2 bg-slate-400 px-2"
        >
          Click for new draft
        </button>
      </div>

      <main className="mb-40">
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {draft && <DraftEditor draft={draft} />}
      </main>
    </div>
  );
}

const Post: ComponentType<{ post: IPostDoc & { id: string } }> = (props) => {
  return <div className="rounded border p-4">{props.post.content}</div>;
};

let index = 0;

const DraftEditor: ComponentType<{
  draft: IPostDoc & { id: string };
}> = (props) => {
  const control = useControl(() =>
    createFormControl(`Draft number ${(index++).toString()}`),
  );

  const onSubmit = useCallback(() => {
    const post: IPostDoc = {
      ...props.draft,
      content: control.value,
      sentAt: Timestamp.now(),
    };

    console.log("Sending draft...", post);

    updateDraft(props.draft.id, post);
  }, [props.draft]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="m-4 rounded border-2 border-green-500"
    >
      <Input control={control} />

      <button
        type="button"
        onClick={onSubmit}
        className="rounded border-2 bg-green-300 px-2"
      >
        Click to submit
      </button>
    </form>
  );
};

const Input: ComponentType<{ control: IFormControl<string> }> = (props) => {
  const value = useControlState(() => props.control.value, [props.control]);

  return (
    <textarea
      value={value}
      autoFocus
      placeholder="Type here..."
      className="rounded border-2 border-green-500"
      onChange={(e) => props.control.setValue(e.target.value)}
    ></textarea>
  );
};
