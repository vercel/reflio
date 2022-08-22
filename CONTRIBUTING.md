# Contributing to Reflio

We greatly appreciate any contributions made to Reflio, and as an early contributor, your contribution will make a huge and lasting impact to Reflio.

- Before jumping into a PR be sure to search [existing PRs](https://github.com/Reflio-com/reflio/pulls) or [issues](https://github.com/Reflio-com/reflio/issues) for an open or closed item that relates to your submission.

## Developing

The development branch is `main`. This is the branch that all pull requests should be made against. The changes on the `main` branch are tagged into each new release of Reflio.

To develop locally:

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

2. Create a new branch:

   ```sh
   git checkout -b MY_BRANCH_NAME
   ```

3. Install yarn:

   ```sh
   npm install -g yarn
   ```

4. Install the dependencies with:

   ```sh
   yarn
   ```

5. Start developing and watch for code changes:

   ```sh
   yarn dev
   ```
## Required .env variables
In the project root, you will find a ``.env.example`` file which is split by ``#REQUIRED FOR BUILD`` and ``OPTIONAL / NOT REQUIRED FOR BUILD``. 

**Reflio uses Supabase as an auth, storage and PostgreSQL database provider. You will need to create a free account via [Supabase.com](https://app.supabase.com) to get your required database variables.**

### Supabase Setup

1. Signup to Supabase via [Supabase.com](https://app.supabase.com) with your GitHub account
2. Click "New project"
3. Create a new organisation, **"reflio"** as an example
4. Enter a database name and password, select your preferred region and choose the free pricing plan
5. Click "Create new project"
6. Once your project has finished setting up, copy the ``anon public`` key to your ``NEXT_PUBLIC_SUPABASE_URL`` env variable, copy ``service_role secret`` to ``SUPABASE_SERVICE_ROLE_KEY`` and lastly ``URL`` to ``NEXT_PUBLIC_SUPABASE_URL``.
7. Lastly, go to the **"SQL Editor"** tab in Supabase, click "New query", then copy and paste the entire ``schema.sql`` file contents within the ``/schema`` folder located the root of your Reflio folder.

Your Supabase instance should now be setup, allowing you to complete a ``yarn build`` succesfully.

## Building

You can build the project with:

```bash
yarn build
```

Please be sure that you can make a full production build before pushing code.

If you get errors, be sure to fix them before committing.

## Making a Pull Request

- Be sure to [check the "Allow edits from maintainers" option](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) while creating you PR.
- If your PR refers to or fixes an issue, be sure to add `refs #XXX` or `fixes #XXX` to the PR description. Replacing `XXX` with the respective issue number. Se more about [Linking a pull request to an issue
  ](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
- Be sure to fill in the PR Template accordingly.
