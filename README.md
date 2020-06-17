# Work In Progress
This project is not yet functional.

# Uptime Monitor
NODEJS based uptime monitor.

### Project Structure
```yaml
/classes
  @base # Base Handler Class
  sentry # Base Error service
  uptime # Uptime Handler Class
  verify # Server Monitor Class
/methods
  uptime-cron.js # runs every 5 minutes.
  verify # handles server registration.
index.js # main app script.
```

### Setup/Installation.
Firstly You will need to have a Server (with ssh access) ready. You should then update `/deploy.json` under *deploy>production>host* change `x.x.x.x` to your server IP. You will need to setup a user (by default this project assumes the user is called `appuser`), SSH keys will need to be setup under this users home dir `.ssh` folder.

### Details.
- `fastify` is used to handle http requests. *production* environment runs stricly from `127.0.0.1`, other environments run from `0.0.0.0`. If no env.PORT is specified it will be randomized.
- `bull` is used to detach requests into seperate processes in a queue. This helps prevent flooding and hitting external service request limits.

### Deployment
Before deploying you need to ensure that you have the `id_rsa` private key.

Recommended `~/.ssh/config` settings...
```shell
Host X.X.X.X
  User appuser
  IdentityFile ~/.ssh/id_rsa
```
To deploy to your production server, Run `npm run deploy`. this process will ssh into the remote machine, git pull the master branch and restart the service.