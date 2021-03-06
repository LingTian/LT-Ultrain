import { Contract } from "ultrain-ts-lib/src/contract";
import { Random } from "./lib/random.lib";
import { RNAME, NAME } from "ultrain-ts-lib/src/account";
import { Action } from "ultrain-ts-lib/src/action";
// import { Log } from "ultrain-ts-lib/src/log";

class Character implements Serializable, Returnable{

  realName: string = "";
    hp: u64 = 0;
    mp: u64 = 0;
    str: u64 = 0;
    intelli: u64 = 0;
    san: u64 = 0;
    luck: u64 = 0;
    charm: u64 = 0;
    mt: u64 = 0;
    optionalAttrs: string = "";
    isActive: bool = true;

    toString(): string {
        var output: string = ""
        return output;
    }

}
//
// class Configuration implements Serializable {
//   @primaryid
//   id: u64;
//   value: u64;
// }
//
class Record implements Serializable {
    @primaryid
    total: u64;
    value: u64;
}
//
// class LotteryRecord implements Serializable, Returnable {
//   @primaryid
//   blockNum: u64;
//   lotUsers: Array<account_name>;
//   absence: Array<account_name>;
//
//   constructor() {
//     this.lotUsers = new Array<account_name>();
//     this.absence = new Array<account_name>();
//   }
//
//   toString(): string {
//     var output: string = "Block number: " + this.blockNum.toString() + ". Lotted users:";
//     for (let i = 0; i < this.lotUsers.length; i++) {
//       output = output + " " +  RNAME(this.lotUsers[i]);
//     }
//     output = output + ". Absence users:"
//     for (let i = 0; i < this.absence.length; i++) {
//       output = output + " " + RNAME(this.absence[i]);
//     }
//     return output;
//   }
// }

const CHARACTER_TABLE = "character";
const RECORD_TABLE = "record";
// const CONST_TABLE = "config";

const MAX_BCK_NUM_KEY: u64 = 1;
const BONUS_AMOUNT_KEY: u64 = 2;
@database(Character, CHARACTER_TABLE)
@database(Record, RECORD_TABLE)

class GarbageCollection extends Contract {
  private random: Random;
  private CharacterDB: DBManager<Character>;
  private recordDB: DBManager<Record>;
  constructor(code: u64){
    super(code);
    this.random = new Random();
    this.CharacterDB = new DBManager<Character>(NAME(CHARACTER_TABLE), NAME(CHARACTER_TABLE));
    this.recordDB = new DBManager<Record>(NAME(RECORD_TABLE), NAME(RECORD_TABLE));
    // this.lotteryDB = new DBManager<LotteryRecord>(NAME(RECORD_TABLE), NAME(RECORD_TABLE));
    // this.configDB = new DBManager<Configuration>(NAME(CONST_TABLE), NAME(CONST_TABLE));
  }

  @action
  insertCharacter( realName: string, hp: u64, mp: u64, str: u64, intelli: u64, san: u64, luck: u64, charm: u64, mt: u64, optionalAttr: string ): u64{
  var character = new Character();
  character.realName=realName;
  character.hp=hp;
  character.mp=mp;
  character.str=str;
  character.intelli=intelli;
  character.san=san;
  character.luck=luck;
  character.charm=charm;
  character.mt=mt;
  character.optionalAttrs=optionalAttr;
  this.CharacterDB.emplace(character);
  var cNum = this.getRecordMaxNum();
  var nCNum= cNum+1;
  this.updateRecordMaxNum(nCNum);
  return cNum;
  }

  private getRecordMaxNum(): u64 {
      var record = new Record();
        if (this.recordDB.exists(MAX_BCK_NUM_KEY)) {
            this.recordDB.get(MAX_BCK_NUM_KEY, record);
            return record.value;
        }
        return 0;

    }
    private updateRecordMaxNum(blockNum: u64): void {
          // Log.s("updateRecordMaxNum: ").i(blockNum).flush();
          var record = new Record();
          record.total = MAX_BCK_NUM_KEY;
          record.value = blockNum;
          if (!this.recordDB.exists(MAX_BCK_NUM_KEY)){
            this.recordDB.emplace(record);
          } else {
            this.recordDB.modify(record);
          }
        }
    // private parseCharacter(character: Character): string {
    //     // Log.s("updateRecordMaxNum: ").i(blockNum).flush();
    //     var record = new Record();
    //     record.total = MAX_BCK_NUM_KEY;
    //     record.value = blockNum;
    //     if (!this.recordDB.exists(MAX_BCK_NUM_KEY)){
    //         this.recordDB.emplace(record);
    //     } else {
    //         this.recordDB.modify(record);
    //     }
    // }
    hp: u64 = 0;
    mp: u64 = 0;
    str: u64 = 0;
    intelli: u64 = 0;
    san: u64 = 0;
    luck: u64 = 0;
    charm: u64 = 0;
    mt: u64 = 0;
    optionalAttrs: string = "";

    @action
    getCharacter(cid:u64): Character {
      var character = new Character();
      this.CharacterDB.get(cid,character);
//.realName+"|"+character.hp.+"|"+character.mp+"|"+character.str+"|"+character.intelli
      return character;
    }
  // @action
  // register(account: account_name, realName: string): void {
  //   Action.requireAuth(this.receiver);
  //   ultrain_assert(!this.staffDB.exists(account), RNAME(account) + " has registered.");
  //   var staff = new Staff();
  //   staff.name = account;
  //   staff.realName = realName;
  //   this.staffDB.emplace(staff);
  // }

  // private getRecordMaxNum(): u64 {
  //   var record = new Record()();
  //     if (this.recordDB.exists(MAX_BCK_NUM_KEY)) {
  //         this.recordDB.get(MAX_BCK_NUM_KEY, record);
  //         return record.value;
  //     }
  //     return 0;
  //   //
  //   // var config = new Configuration();
  //   // if (this.configDB.exists(MAX_BCK_NUM_KEY)) {
  //   //   this.configDB.get(MAX_BCK_NUM_KEY, config);
  //   //   return config.value;
  //   // }
  //   // return 0;
  // }
  //
  // private updateRecordMaxNum(blockNum: u64): void {
  //   // Log.s("updateRecordMaxNum: ").i(blockNum).flush();
  //   var record = new Record();
  //   record.id = MAX_BCK_NUM_KEY;
  //   record.value = blockNum;
  //   if (!this.configDB.exists(MAX_BCK_NUM_KEY)){
  //     this.configDB.emplace(config);
  //   } else {
  //     this.configDB.modify(config);
  //   }
  // }
  //
  // private getLottedUser(): Array<account_name> {
  //   var bckNum = this.getRecordMaxNum();
  //   if (bckNum == 0) {
  //     return new Array<account_name>();
  //   }
  //   var lottery = new LotteryRecord();
  //   this.lotteryDB.get(bckNum, lottery);
  //   var bonusUsers = new Array<account_name>();
  //   for (let i = 0; i < lottery.lotUsers.length; i++) {
  //     let isRevised = false;
  //     for (let j = 0; j < lottery.absence.length; j++) {
  //       if (lottery.absence[j] == lottery.lotUsers[i]) {
  //         isRevised = true;
  //         break;
  //       }
  //     }
  //     if (!isRevised) {
  //       bonusUsers.push(lottery.lotUsers[i]);
  //     }
  //   }
  //   return bonusUsers;
  // }
  //
  // private issueBonus(): void {
  //   var bonusUsers = this.getLottedUser();
  //   var bonus = this.getBonus();
  //   if (bonusUsers.length == 1) {
  //     this.sendBonusToUser(bonusUsers[0], bonus * 2);
  //   } else {
  //     for (let i = 0; i < bonusUsers.length && i < 2; i++) {
  //       this.sendBonusToUser(bonusUsers[i], bonus);
  //     }
  //   }
  // }
  //
  // private getBonus(): u64  {
  //   if (!this.configDB.exists(BONUS_AMOUNT_KEY)) {
  //     return 1;
  //   }
  //   var config = new Configuration();
  //   this.configDB.get(BONUS_AMOUNT_KEY, config);
  //   return config.value;
  // }
  //
  // @action
  // query(): Array<string> {
  //   var lottedUsers = this.getLottedUser();
  //   var staff = new Staff();
  //   var result = new Array<string>();
  //   for (let i = 0; i < lottedUsers.length; i++) {
  //     if (this.staffDB.exists(lottedUsers[i])) {
  //       this.staffDB.get(lottedUsers[i], staff);
  //       result.push(RNAME(lottedUsers[i]) + ":" + staff.realName);
  //     }
  //   }
  //   return result;
  // }
  //
  // @action
  // setBonus(bonus: u64) : void {
  //   Action.requireAuth(this.receiver);
  //   var config = new Configuration();
  //   config.id = BONUS_AMOUNT_KEY;
  //   config.value = bonus;
  //
  //   if (!this.configDB.exists(BONUS_AMOUNT_KEY)) {
  //     this.configDB.emplace(config)
  //   } else {
  //     this.configDB.modify(config);
  //   }
  // } 
  //
  // private sendBonusToUser(name: account_name, bonus: u64): void {
  //   // Log.s("sendBonusToUser: ").s(RNAME(name)).flush();
  //   if (this.staffDB.exists(name)) {
  //     let staff = new Staff();
  //     this.staffDB.get(name, staff);
  //     staff.bonus = staff.bonus + bonus;
  //     this.staffDB.modify(staff);
  //   }
  // }
  //
  // @action
  // lottery(): LotteryRecord {
  //   Action.requireAuth(this.receiver);
  //   // Notice: Should iterater the staff firstly. 
  //   var cursor: Cursor<Staff> = this.staffDB.cursor();
  //   var staffAccounts = new Array<account_name>();
  //   while(cursor.hasNext()) {
  //     let staff: Staff = cursor.get();
  //     staffAccounts.push(staff.name);
  //     cursor.next();
  //   }
  //
  //   // Issue the last bonus.
  //   this.issueBonus();
  //  
  //   // Lot the users
  //   var randRecord = this.random.queryLatest();
  //   var record = new LotteryRecord();
  //   record.blockNum = randRecord.blockNum;
  //   var userCount = staffAccounts.length;
  //   if (userCount <= 2) {
  //     record.lotUsers = staffAccounts;
  //   } else {
  //     let index = 0;
  //     let randNum = randRecord.val;
  //     while (index < 5 && index < userCount ) {
  //       let toAddIndex = randNum % userCount;
  //       let account = staffAccounts[<i32>toAddIndex];
  //       while(record.lotUsers.includes(account)) {
  //         account = staffAccounts[<i32>((++toAddIndex) % userCount)];
  //       }
  //       record.lotUsers.push(account);
  //       index ++;
  //       randNum = this.random.hash(randNum);
  //     }
  //   }
  //   this.updateRecordMaxNum(randRecord.blockNum);
  //   this.lotteryDB.emplace(record);
  //   return record;
  // }
  //
  // @action
  // revise(bckNum: u64, staffs: Array<account_name>): void {
  //   Action.requireAuth(this.receiver);
  //   var maxBckNum = this.getRecordMaxNum();
  //   ultrain_assert(maxBckNum == bckNum, "Only can update the round data: " + maxBckNum.toString());
  //
  //   var lottery = new LotteryRecord();
  //   this.lotteryDB.get(bckNum, lottery);
  //
  //   var lotUsers = lottery.lotUsers;
  //   var absence = new Array<account_name>();
  //   for (let i = 0; i < staffs.length; i++) {
  //     let staff = staffs[i];
  //     ultrain_assert(lotUsers.includes(staff), RNAME(staff) + " not lotted");
  //     absence.push(staff)
  //   }
  //   lottery.absence = absence;
  //   this.lotteryDB.modify(lottery);
  // }
  //
  // @action
  // unregister(name: account_name): void {
  //   Action.requireAuth(this.receiver);
  //   if (this.staffDB.exists(name)) {
  //     this.staffDB.erase(name);
  //   } else {
  //     ultrain_assert(false, "Account name: " + RNAME(name) + " not existed.")
  //   }
  // }
}