# Firebase Issue Reproduction

This is a bug that occurs when Firestore multi-tab-persistence is turned on, you have two tabs open to the same app, and you submit mutations in the tab which is not the Firestore leader tab. If you submit mutations in the tab which has been internally designated by Firestore as the leader, than everything works as expected.

- Note: my interpretation that "the Firestore leader tab" is important is based on my experience recreating the bug. I don't know for a fact that that is what triggers this (but I think it is).

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
   3. Note the console log statements
8. In the second tab (i.e. the same one as before)
   1. click the button to create a new draft
   2. Click the button to submit the new tab
      - Feel free to edit the draft content or accept the default content--it doesn't matter.
9. At this point you should see that the second time you submitted the new draft the console log statements are different from before. They shouldn't be. If you create another new draft and submit it you'll find the console.log statements are again wrong. This is the bug.
