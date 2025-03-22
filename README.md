AWS Lambda Files for a Discord Bot

These are just the files that would go into the lambda function. Setup / Registering / Deregistering can be found online.


**Cuurrently any command that requires an API call will usually fail the first time. I believe this is due to the lambda function going "cold". This could possibly be fixed by having cloudwatch ping the command every 5 mins, so that the function is kept active. A longer time could work, but I found that 5 works fine.**