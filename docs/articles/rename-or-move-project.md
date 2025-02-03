---
title: How to rename or move a project
sidebar_label: Rename/Move Project
---

Projects can't be moved between accounts or renamed in Zuplo but there is an
easy workaround using Source Control.

If the project you want to move or rename isn't already connected to source
control then
[follow our GitHub integration guide](/docs/articles/source-control). This will
copy the contents of your project to a GitHub repository.

If your project is already connected to Source Control (or you just connected it
above) the next step is to push any changes you want to be included in when you
move to a different project.

If you're confident all your code is stored safely in the repository you can now
disconnect the project from Source Control.

![Disconnect Project](../../public/media/rename-or-move-project/image.png)

Next create a new project in the correct account if moving accounts or with the
correct name. Choose the `Advanced` option on the new project dialog.

![Import existing project](../../public/media/source-control/image-1.png)

You should see a list of organizations and repositories - pick the source
repository you wanted to move and click **Create Project from repository**.

Your new project will now be connected to this repository and ready to go.

NOTE - assets and data that isn't 'code' and stored in the repository won't be
moved. Things that won't be moved when renaming a project include:

- API Key consumers
- Environment variable values
- Permissions / Project Members
- Custom Domains (contact us to move these for you)
