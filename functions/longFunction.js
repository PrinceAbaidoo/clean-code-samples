function changePassword(email, oldPassword, newPassword) {
    var user = getUser(email);
  var oldPasswordDecrypted = decrypt(oldPassword)
   var newPasswordDecrypted = decrypt(newPassword)
var existingPasswordDecrypted = decrypt(user.password)
 
  if (user === null || existingPasswordDecrypted !== oldPasswordDecrypted) {
    throw new EmailPasswordMissMatchException();
  }
 if (oldPasswordDecrypted === newPasswordDecrypted) {
throw new PasswordAlreadyInUseException();
  }
 if (user.isAdmin) {
var isError = false;
  try {
 user.password = newPassword;
 save(user);
  // clear the session when the user changes the password
 // so that he/she has to log in again
 clearSession(user);
  } catch (e) {
    isError = true;
    // throw something went wrong, try again
  } finally {
  if (!isError) {
  var emails = user.getEmails();
  var token = generatePasswordRevertToken(oldPassword, newPassword);
  for (i = 0; i < emails.length; i++) {
  // Confirm with admin that he as in fact changed the password,
   // if he has not, give him option to reset the password using token
  sendConfirmationEmail(email[i], token);
   }
   }
  }
  } else {
    if (user.isEnabled) {
    try {
   user.password = newPassword;
   save(user);
  // clear the session when the user changes the password
   // so that he/she has to log in again
   clearSession(user);
   } catch (e) {
  throw new SomethingWentWrongException();
   }
    } else {
    throw new UnsupportedOperationException();
    } }
}
