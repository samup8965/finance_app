// This is where I build the URL to redirect the user to authenticate process

const ConnectBank = () => {
  const handleConnectBank = () => {
    window.location.href =
      "https://auth.truelayer-sandbox.com/?response_type=code&client_id=sandbox-personalfinancetracker-561293&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Ftruelayercallback&providers=uk-cs-mock%20uk-ob-all%20uk-oauth-all";
  };
  return <button onClick={handleConnectBank}>ConnectBank</button>;
};

export default ConnectBank;
