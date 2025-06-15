# Quick Git Changelog

## [Diffs and deletes] - {PR_MERGE_DATE}

- Show and hide diffs for changed files
- Add `Open With…` action
- Add option to hard delete a branch if the `Delete Branch` action fails
- Add option for force push (with lease) if the `Push Branch` action fails
- Various under the hood changes and refactors

## [Initial Version] - 2025-06-10

Select a git repository and display a list of changed files, along with some information about the current branch.

Supported git actions:
- Check status of the repo
- Stage and unstage changes, you can do this to all files at once or individually
- Commit the currently staged changes
- Discard changes and restore a file to its previous state
- Push, pull and fetch a branch
- Stash all unstaged files
- Open or copy a file
- Create, delete and switch branches
