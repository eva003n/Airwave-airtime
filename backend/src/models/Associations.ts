import Recipient from "./Recipients.js";
import Topup from "./Topups.js";
import User from "./User.js";

const defineAssociations = () => {
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

  Recipient.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "recipient_id",
    as: "topups",
  });

  Topup.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  Recipient.belongsTo(User, {
    foreignKey: "user_id",
    as: "recipient",
  });

  Topup.belongsTo(Recipient, {
    foreignKey: "recipient_id",
    as: "recipient"
  })
};

export { defineAssociations };
