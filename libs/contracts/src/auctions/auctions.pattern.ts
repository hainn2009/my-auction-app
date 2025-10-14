export const AUCTIONS_PATTERN = {
  AUCTIONS: {
    FIND_ALL: 'auctions.auctions.findAll',
    FIND_ONE: 'auctions.auctions.findOne',
    CREATE: 'auctions.auctions.create',
    UPDATE: 'auctions.auctions.update',
    REMOVE: 'auctions.auctions.remove',
    STATS: 'auctions.auctions.stats',
    MY_AUCTIONS: 'auctions.auctions.myAuctions',
    PLACE_BID: 'auctions.auctions.placeBid',
    WRITE_DB: 'auctions.auctions.writeDb',
  },
  BIDS: {
    FIND_ALL: 'auctions.bids.findAll',
    FIND_ONE: 'auctions.bids.findOne',
    CREATE: 'auctions.bids.create',
    UPDATE: 'auctions.bids.update',
    REMOVE: 'auctions.bids.remove',
    BROAD_CAST_BID_RESULT: 'auctions.bids.broadcastBidResult',
  },
};

export const AUCTIONS_QUEUE = {
  MAIN: 'auctions_main_queue',
  WRITE_DB: 'auctions_write_db_queue',
};
