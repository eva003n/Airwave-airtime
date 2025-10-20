import Recipient from "./Recipients.js";
import Topup from "./Topups.js";
import User from "./User.js";

let associationsDefined = false;

const defineAssociations = () => {
  if (associationsDefined) return;
  //  User owns many recipients and topups
  User.hasMany(Recipient, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "recipients",
  });

  User.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "topups",
  });

  // Recipient has many topups
  Recipient.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "recipient_id",
    as: "recipientTopups",
  });

  // Topup belongs to a user (the one who created it)
  Topup.belongsTo(User, {
    foreignKey: "user_id",
    as: "creator", // changed from 'user'
  });

  // Recipient belongs to a user (the owner of recipient)
  Recipient.belongsTo(User, {
    foreignKey: "user_id",
    as: "owner",
  });

  // Topup belongs to a recipient
  Topup.belongsTo(Recipient, {
    foreignKey: "recipient_id",
    as: "recipient",
  });
  associationsDefined = true;
};

export { defineAssociations };
