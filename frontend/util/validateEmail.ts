export function validateEmailAddress(rule: any, emailAddress: string) {
  var atSymbol = emailAddress.indexOf("@");
  var dotSymbol = emailAddress.lastIndexOf(".");
  var spaceSymbol = emailAddress.indexOf(" ");

  return (
    atSymbol != -1 &&
    atSymbol != 0 &&
    dotSymbol != -1 &&
    dotSymbol != 0 &&
    dotSymbol > atSymbol + 1 &&
    emailAddress.length > dotSymbol + 1 &&
    spaceSymbol == -1
  );
}
