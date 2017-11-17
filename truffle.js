module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      host: 'localhost',
      port: 8545,
      network_id: 4
    },
    real: {
      host: '176.112.204.112',
      port: 8545,
      network_id: 1
    }

  }
};
