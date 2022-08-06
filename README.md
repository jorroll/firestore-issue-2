# Firebase Issue Reproduction

See this video for a walkthrough of the bug:

- https://www.loom.com/share/65b4a560af5348c38f44e82ce4dd9044

This is a bug that occurs when Firestore multi-tab-persistence is turned on, you have two tabs open to the same app, and you submit mutations in the tab which is not the Firestore leader tab. Conversely, if you submit mutations in the tab which has been internally designated by Firestore as the leader, than everything works as expected.

- Note: my interpretation that "the Firestore leader tab" is important is based on my experience recreating the bug. I don't know for a fact that that is involved with triggering the bug (but I think it is).

1. Clone repository
   - Note: there's an included `.devcontainer` which you can use if you're into that sort of thing.
2. `yarn install`
3. `yarn emulators` in one terminal tab
4. `yarn dev` in another terminal tab
5. Open the app on http://localhost:3000 and open the browser console
6. Open a second tab to the app on http://localhost:3000 and open the browser console
7. In the second tab (which is **_not_** the Firestore leader tab)
   1. click the button to create a new draft
   2. Click the button to submit the new tab
      - Feel free to edit the draft content or accept the default content--it doesn't matter.
8. At this point, you should be able to note the `console.log` statements for the second tab and the first tab do not match. In the second tab, the console statements should indicate that, after submitting the draft, Firestore is emitting an update as expected, then emitting a stale value (i.e. the bug), then emitting the correct value again.
