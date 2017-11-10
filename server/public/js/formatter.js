function formatAmount(amount) {
  if (amount) {
        amount = amount + '';
        //regex to remove dollar and comma
        amount = amount.replace(/[^\d.]/g, '').replace(/^\./, '').replace(/(.*)\.$/, "$1");
              //regex to add comma
        amount = amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

          return amount;
  }
  return amount;
}