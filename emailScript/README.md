# emailScript

This email script runs in a docker container. It allows for a custom richtext and
plaintext document to be sent to a list of emails in a CSV. Both of these
documents can contain spots for interpolated values.

We are sending these bulk emails using SendBulkTemplatedEmail with Amazon SES.

## Setup
Create a `secret.env` file that looks like this:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

Create a csv in the following format:
first_name,last_name,email
FirstName1,LastName1,name@gmail.com

Create a richtext document with interpolated values like {{first_name}} and
{{last_name}}

Create a plaintext document that can also have interpolated values

Modify the `config.rb` file to identify these documents and other specifications

## Run
```
sh dockerExec.sh
```

## Stop
```
docker rm -f sesContainer
```

## Logs
```
docker logs sesContainer
```
