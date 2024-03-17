## User flow

1. \*\* User can be created when they sign in with their wallet , and sign a message , we will handleUser , to check is the user exists , if not , then just create the user for the first time.

Referrals - URL will have the referral Code , our frontend hook will look for the code , and if one is present , we add the referral to our database

2. \*\* Handling the interactions like Minting and bridging NFTs , once the user compeltes these actions , we wait for the tx to succed ,and then we call the api handler to add these interaction for this user in the db
