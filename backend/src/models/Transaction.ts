/*
Creating a database ledger model to track all transactions within the system.

Resources
https://www.moderntreasury.com/learn/ledger-database

https://www.architecture-weekly.com/p/building-your-own-ledger-database


https://medium.com/@mahammadkhalilov/how-to-build-a-custom-ledger-system-a-comprehensive-guide-838c73ca512d
*/

//this must be a paranoid table to allow for soft deletes and audit trails

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";