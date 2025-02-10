## Using the Policy

In order to use this policy, you'll need to setup Azure storage. You'll find
instructions on how to do that below.

### Setup Azure

First, let's set up Azure. You'll need a container in Azure storage
([docs](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)).
Once you have your container you'll need the URL - you can get it on the
`properties` tab of your container as shown below.

![Azure](../../public/media/guides/archiving-requests-to-storage/Untitled.png)

This URL will be the `blobPath` in our policy options.

Next, we'll need a SAS (Shared Access Secret) to authenticate with Azure. You
can generate one of these on the `Shared access tokens` tab.

Note, you should minimize the permissions - and select only the `Create`
permission. Choose a sensible start and expiration time for your token. Note, we
don't recommend restricting IP addresses because Zuplo runs at the edge in over
200 data-centers world-wide.

![Create permission](../../public/media/guides/archiving-requests-to-storage/Untitled_1.png)

Then generate your SAS token - copy the token (not the URL) to the clipboard and
enter it into a new environment variable in your API called `BLOB_CREATE_SAS`.
You'll need another environment variable called `BLOB_CONTAINER_PATH`.

![SAS token](../../public/media/guides/archiving-requests-to-storage/Untitled_2.png)
