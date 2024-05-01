// Flow for integrations

1. Subscribe to etherway
   -> POST /contact - create a new Contact in the mail jet List
   -> POST /listrecipient - create a new list recipient for a relationship b/w contact and contact List with the listId & contactID , isUnsubscribed as true
   -> POST /send - email containing a dynamic link with listID

2. Verify the subscription for etherway
   -> PUT /listrecipient/{listrecipient_ID} - to mark isUnsubscribed as false

3. Send the Welcome email
   -> POST /send - email for welcoming the user to etherway

4. Unsubscribe to etherway
   -> PUT /listrecipient/{listrecipient_ID} - to mark isUnsubscribed as true
