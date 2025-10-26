import User from "./User.js";
import Recipient from "./Recipient.js";
import Topup from "./Topup.js";
import Wallet from "./Wallet.js";

let associationsDefined = false;

const defineAssociations = () => {
  if (associationsDefined) return;
  //  User owns many recipients and topups
  User.hasMany(Recipient, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "recipients",

    // Recipients cannot exist without a user so delete all associated recipients when user is deleted
    onDelete: "CASCADE",
    // when i update user id which is rare, update user_id column in recipient table as well
    onUpdate: "CASCADE",
  });

  // Recipient belongs to a user (the owner of recipient)
  Recipient.belongsTo(User, {
    foreignKey: "user_id",
    as: "owner",
  });

  User.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "topups",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Topup belongs to a user (the one who created it)
  Topup.belongsTo(User, {
    foreignKey: "user_id",
    as: "distributor", // changed from 'user'
  });

  User.hasOne(Wallet, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "wallet",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Wallet.belongsTo(User, {
    foreignKey: "user_id",
    as: "owner",
  });

  // Recipient has many topups
  Recipient.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "recipient_id",
    as: "recipientTopups",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Topup belongs to a recipient
  Topup.belongsTo(Recipient, {
    foreignKey: "recipient_id",
    as: "recipient",
  });
  associationsDefined = true;
};

export { defineAssociations };
