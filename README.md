<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/5968/5968875.png" width="200" alt="Logo" />
</p>

## How to make it work
Migrate and seed the data.
The default username and password are as follows:

- username: shuaaum
- password: secret

Yes. Authentication is implemented. Once you seed, by default, it will seed the above mentioned user along with a jira pat and the jira email address which will
point you to my personal jira account. If you want to change these values, login to the UI and go to your profile and change the details from there.

## What's in the application?

You can view yours issues, projects and a nice little dashboard which took forever to make. Within the pages for projects and
issues, you will find a button to sync the data to the db.

As for emailing the pending stuff, there is a command added to the application. The idea is to use a cronjob to run this command every now and then.

Simply run `npx nestjs-command notify-pending-issues` after you have set the email config in the env. The example env will contain my personal credentials for the demo.
After running, it will do exactly what it was asked. That is take pending issues and email them to the person who owns the task.

There's more. And a lot more could have been improved. With a little more time. It could have been perfected. Like how Jira has the weirdest data set so for now, tasks, story etc will work. If it is parented, it probably will fail. 