# As we enable more hosting account templates, we will document the purpose of each here

## onboard-account.cfn.yaml
A CFN template that creates all resources SWB needs to manage the relationship between the main and hosting accounts.

## onboard-account-byon.cfn.yaml
A CFN template that does everything onboard-account.cfn.yaml does, except allows the hosting account to use its own VPCs.

