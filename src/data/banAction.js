const { getDatabaseCollection, executeWithCatch } = require("@data/mongo.js");
const { BanType } = require("@model/banAction.js");

class BanActionRepository {
   constructor() {
      if (BanActionRepository.instance) {
         return BanActionRepository.instance;
      }
      this.collectionName = "ban_actions";
      BanActionRepository.instance = this;
   }

   static async getInstance() {
      if (!BanActionRepository.instance) {
         BanActionRepository.instance = new BanActionRepository();
         await BanActionRepository.instance.initialize();
      }
      return BanActionRepository.instance;
   }

   async initialize() {
      this.collection = await getDatabaseCollection(this.collectionName);
   }

   async insertBanAction(banAction) {
      return executeWithCatch("insertBanAction", async () => {
         await this.collection.insertOne(banAction);
         return banAction;
      });
   }

   async getLatestBanActionByGuildIdAndUserId(guildId, userId) {
      return executeWithCatch("getLatestBanActionByGuildIdAndUserId", async () => {
         const latestBanAction = await this.collection
            .find({ guildId: guildId, userId: userId })
            .sort({ createdDate: -1 })
            .limit(1)
            .toArray();
         if (latestBanAction.length) {
            return latestBanAction[0];
         }
      });
   }

   async getBanActionsByGuildId(guildId) {
      return executeWithCatch("getBanActionsByGuildId", async () => {
         return await this.collection.find({ guildId: guildId }).sort({ createdDate: 1 }).toArray();
      });
   }

   async getCurrentBansByGuildId(guildId) {
      return executeWithCatch("getCurrentBansByGuildId", async () => {
         return await this.collection
            .aggregate([
               { $match: { guildId: guildId } },
               { $sort: { createdDate: -1 } },
               {
                  $group: {
                     _id: "$userId",
                     latestBan: { $first: "$$ROOT" },
                  },
               },
               { $replaceRoot: { newRoot: "$latestBan" } },
               { $match: { type: BanType.BAN } },
            ])
            .toArray();
      });
   }

   async getBanActionsByGuildIdAndUserId(guildId, userId) {
      return executeWithCatch("getBanActionsByGuildIdAndUserId", async () => {
         return await this.collection
            .find({ guildId: guildId, userId: userId })
            .sort({ createdDate: 1 })
            .toArray();
      });
   }
}

module.exports = BanActionRepository;
